-- Music OS initial schema. RLS enabled; server uses service role only.

create extension if not exists "pgcrypto";

-- songs
create table public.songs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  artist text,
  stage text not null default 'discovering'
    check (stage in ('discovering', 'learning', 'comfortable', 'recorded', 'shared')),
  comfort_level text not null default 'not_comfortable'
    check (comfort_level in ('not_comfortable', 'getting_there', 'comfortable', 'ready_to_record')),
  notes text,
  why_this_song text,
  target text,
  last_worked_at timestamptz,
  is_shared boolean not null default false
);

-- sessions
create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  date date not null default current_date,
  song_id uuid references public.songs(id) on delete set null,
  intention text,
  feeling_before text check (feeling_before is null or feeling_before in ('nervous', 'neutral', 'excited')),
  what_worked_on text,
  what_felt_better text,
  what_felt_stuck text,
  quality_rating int check (quality_rating is null or (quality_rating between 1 and 5)),
  started_at timestamptz,
  logged_at timestamptz
);

-- weekly_reflections
create table public.weekly_reflections (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  week_label text not null unique,
  focus_song text,
  focus_feeling text,
  what_felt_hard text,
  what_felt_good text,
  tiny_win text not null,
  do_differently text
);

-- coach_messages
create table public.coach_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  session_date date not null default current_date
);

-- indexes
create index sessions_date_idx on public.sessions (date desc);
create index sessions_song_id_idx on public.sessions (song_id);
create index coach_messages_session_date_idx on public.coach_messages (session_date desc);

-- keep songs.last_worked_at in sync when a session is logged
create or replace function public.update_song_last_worked_at()
returns trigger
language plpgsql
as $$
begin
  if new.song_id is not null and new.logged_at is not null then
    update public.songs
    set last_worked_at = new.logged_at
    where id = new.song_id;
  end if;
  return new;
end;
$$;

create trigger sessions_update_song_last_worked
after insert or update of logged_at, song_id on public.sessions
for each row
execute function public.update_song_last_worked_at();

-- RLS: enabled on all tables; no anon/authenticated policies (service role bypasses RLS)
alter table public.songs enable row level security;
alter table public.sessions enable row level security;
alter table public.weekly_reflections enable row level security;
alter table public.coach_messages enable row level security;

revoke all on public.songs from anon, authenticated;
revoke all on public.sessions from anon, authenticated;
revoke all on public.weekly_reflections from anon, authenticated;
revoke all on public.coach_messages from anon, authenticated;

grant all on public.songs to service_role;
grant all on public.sessions to service_role;
grant all on public.weekly_reflections to service_role;
grant all on public.coach_messages to service_role;
