-- Music OS v2 (Phase 5) — depth schema + data-flow engine.
-- Adds the Song Room, Skills Lab, Vocal Studio, and Monthly Report data layers.
-- One Practice Room log fans out via session_songs / session_skills into every screen.
-- RLS enabled on every new table; server uses the service role only.
-- See docs/MUSIC_OS_V2.md.

-- ---------------------------------------------------------------------------
-- 1. songs — header metadata + learning-stage pipeline
-- ---------------------------------------------------------------------------
alter table public.songs add column if not exists key text;
alter table public.songs add column if not exists bpm int;
alter table public.songs add column if not exists time_signature text;
alter table public.songs add column if not exists learning_stage text
  check (
    learning_stage is null or learning_stage in (
      'chords_learned',
      'can_play_through',
      'singing_added',
      'chords_singing_together',
      'rough_take',
      'complete'
    )
  );

-- ---------------------------------------------------------------------------
-- 2. Song Room child tables
-- ---------------------------------------------------------------------------
create table if not exists public.song_parts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  song_id uuid not null references public.songs(id) on delete cascade,
  position int not null default 0,
  name text not null,
  chords text,
  notes text
);

create table if not exists public.song_resources (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  song_id uuid not null references public.songs(id) on delete cascade,
  position int not null default 0,
  label text not null,
  url text not null,
  kind text not null default 'other'
    check (kind in ('youtube', 'backing', 'reference', 'tab', 'other'))
);

create table if not exists public.song_stage_log (
  id uuid primary key default gen_random_uuid(),
  song_id uuid not null references public.songs(id) on delete cascade,
  from_stage text,
  to_stage text not null,
  changed_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 3. Data-flow joins — one daily log fans out
-- ---------------------------------------------------------------------------
create table if not exists public.session_songs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  song_id uuid not null references public.songs(id) on delete cascade,
  unique (session_id, song_id)
);

-- skill_id FK is added after the skills table is created (section 4).
create table if not exists public.session_skills (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  skill_id uuid not null,
  note text
);

-- ---------------------------------------------------------------------------
-- 4. Skills Lab
-- ---------------------------------------------------------------------------
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  category text not null,
  name text not null,
  tier text not null default 'progress'
    check (tier in ('milestone', 'progress', 'evergreen')),
  radar_axis text not null
    check (radar_axis in ('Rhythm', 'Chords', 'Theory', 'Lead', 'Performance', 'Ear')),
  position int not null default 0,
  unique (category, name)
);

create table if not exists public.skill_states (
  id uuid primary key default gen_random_uuid(),
  skill_id uuid not null references public.skills(id) on delete cascade unique,
  milestone_done boolean not null default false,
  progress_value int check (progress_value is null or (progress_value between 1 and 5)),
  updated_at timestamptz not null default now()
);

create table if not exists public.skill_moments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  skill_id uuid references public.skills(id) on delete cascade,
  session_id uuid references public.sessions(id) on delete set null,
  note text
);

create table if not exists public.skill_snapshots (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  month_label text not null,
  axis text not null
    check (axis in ('Rhythm', 'Chords', 'Theory', 'Lead', 'Performance', 'Ear')),
  value numeric not null,
  unique (month_label, axis)
);

-- forward-declare the FK from session_skills now that skills exists
alter table public.session_skills
  drop constraint if exists session_skills_skill_id_fkey;
alter table public.session_skills
  add constraint session_skills_skill_id_fkey
  foreign key (skill_id) references public.skills(id) on delete cascade;

-- ---------------------------------------------------------------------------
-- 5. Vocal Studio
-- ---------------------------------------------------------------------------
create table if not exists public.vocal_range (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  low_note text not null,
  high_note text not null,
  measured_at timestamptz not null default now()
);

create table if not exists public.vocal_warmups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  position int not null default 0,
  name text not null,
  duration_seconds int,
  active boolean not null default true
);

create table if not exists public.vocal_exercises (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  position int not null default 0,
  label text not null,
  url text not null,
  problem_tag text
);

create table if not exists public.vocal_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id uuid references public.sessions(id) on delete set null,
  date date not null default current_date,
  confidence int check (confidence is null or (confidence between 1 and 5)),
  voice_day text check (voice_day is null or voice_day in ('good', 'okay', 'rough')),
  note text
);

-- ---------------------------------------------------------------------------
-- 6. Monthly Report
-- ---------------------------------------------------------------------------
create table if not exists public.monthly_reflections (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  month_label text not null unique,
  reflection text
);

-- ---------------------------------------------------------------------------
-- 7. Indexes
-- ---------------------------------------------------------------------------
create index if not exists song_parts_song_idx on public.song_parts (song_id, position);
create index if not exists song_resources_song_idx on public.song_resources (song_id, position);
create index if not exists song_stage_log_song_idx on public.song_stage_log (song_id, changed_at desc);
create index if not exists session_songs_session_idx on public.session_songs (session_id);
create index if not exists session_songs_song_idx on public.session_songs (song_id);
create index if not exists session_skills_session_idx on public.session_skills (session_id);
create index if not exists session_skills_skill_idx on public.session_skills (skill_id);
create index if not exists skills_category_idx on public.skills (category, position);
create index if not exists skill_moments_skill_idx on public.skill_moments (skill_id, created_at desc);
create index if not exists skill_moments_session_idx on public.skill_moments (session_id);
create index if not exists vocal_logs_date_idx on public.vocal_logs (date desc);
create index if not exists vocal_range_measured_idx on public.vocal_range (measured_at desc);

-- ---------------------------------------------------------------------------
-- 8. Triggers — keep derived data in sync (the data-flow engine)
-- ---------------------------------------------------------------------------

-- 8a. tagging a song in a session bumps songs.last_worked_at
create or replace function public.touch_song_last_worked()
returns trigger
language plpgsql
as $$
begin
  update public.songs
  set last_worked_at = greatest(coalesce(last_worked_at, to_timestamp(0)), now())
  where id = new.song_id;
  return new;
end;
$$;

drop trigger if exists session_songs_touch_song on public.session_songs;
create trigger session_songs_touch_song
after insert on public.session_songs
for each row
execute function public.touch_song_last_worked();

-- 8b. advancing a song's learning_stage auto-writes the timestamped stage log
create or replace function public.log_song_stage_change()
returns trigger
language plpgsql
as $$
begin
  if new.learning_stage is not null
     and new.learning_stage is distinct from old.learning_stage then
    insert into public.song_stage_log (song_id, from_stage, to_stage)
    values (new.id, old.learning_stage, new.learning_stage);
  end if;
  return new;
end;
$$;

drop trigger if exists songs_log_stage_change on public.songs;
create trigger songs_log_stage_change
after update of learning_stage on public.songs
for each row
execute function public.log_song_stage_change();

-- 8c. every skill gets exactly one skill_states row
create or replace function public.create_skill_state()
returns trigger
language plpgsql
as $$
begin
  insert into public.skill_states (skill_id)
  values (new.id)
  on conflict (skill_id) do nothing;
  return new;
end;
$$;

drop trigger if exists skills_create_state on public.skills;
create trigger skills_create_state
after insert on public.skills
for each row
execute function public.create_skill_state();

-- 8d. tagging an evergreen skill in a session auto-captures an evidence moment
--     (this is how Ear Training and other evergreen skills track themselves)
create or replace function public.capture_evergreen_moment()
returns trigger
language plpgsql
as $$
declare
  v_tier text;
begin
  select tier into v_tier from public.skills where id = new.skill_id;
  if v_tier = 'evergreen' then
    insert into public.skill_moments (skill_id, session_id, note)
    values (new.skill_id, new.session_id, new.note);
  end if;
  return new;
end;
$$;

drop trigger if exists session_skills_capture_moment on public.session_skills;
create trigger session_skills_capture_moment
after insert on public.session_skills
for each row
execute function public.capture_evergreen_moment();

-- ---------------------------------------------------------------------------
-- 9. RLS — enable on every new table; service role only (matches initial schema)
-- ---------------------------------------------------------------------------
alter table public.song_parts enable row level security;
alter table public.song_resources enable row level security;
alter table public.song_stage_log enable row level security;
alter table public.session_songs enable row level security;
alter table public.session_skills enable row level security;
alter table public.skills enable row level security;
alter table public.skill_states enable row level security;
alter table public.skill_moments enable row level security;
alter table public.skill_snapshots enable row level security;
alter table public.vocal_range enable row level security;
alter table public.vocal_warmups enable row level security;
alter table public.vocal_exercises enable row level security;
alter table public.vocal_logs enable row level security;
alter table public.monthly_reflections enable row level security;

revoke all on public.song_parts from anon, authenticated;
revoke all on public.song_resources from anon, authenticated;
revoke all on public.song_stage_log from anon, authenticated;
revoke all on public.session_songs from anon, authenticated;
revoke all on public.session_skills from anon, authenticated;
revoke all on public.skills from anon, authenticated;
revoke all on public.skill_states from anon, authenticated;
revoke all on public.skill_moments from anon, authenticated;
revoke all on public.skill_snapshots from anon, authenticated;
revoke all on public.vocal_range from anon, authenticated;
revoke all on public.vocal_warmups from anon, authenticated;
revoke all on public.vocal_exercises from anon, authenticated;
revoke all on public.vocal_logs from anon, authenticated;
revoke all on public.monthly_reflections from anon, authenticated;

grant all on public.song_parts to service_role;
grant all on public.song_resources to service_role;
grant all on public.song_stage_log to service_role;
grant all on public.session_songs to service_role;
grant all on public.session_skills to service_role;
grant all on public.skills to service_role;
grant all on public.skill_states to service_role;
grant all on public.skill_moments to service_role;
grant all on public.skill_snapshots to service_role;
grant all on public.vocal_range to service_role;
grant all on public.vocal_warmups to service_role;
grant all on public.vocal_exercises to service_role;
grant all on public.vocal_logs to service_role;
grant all on public.monthly_reflections to service_role;
