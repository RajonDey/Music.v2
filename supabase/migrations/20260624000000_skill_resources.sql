-- Skill resources dock + practice note on skill_states.
-- Any catalogue skill can have saved material; Stand shows top links at execution time.
-- See docs/MUSIC_OS_V2.md §3 (skill_resources).

alter table public.skill_states
  add column if not exists practice_note text;

create table if not exists public.skill_resources (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  skill_id uuid not null references public.skills(id) on delete cascade,
  position int not null default 0,
  label text not null,
  url text not null,
  kind text not null default 'other'
    check (kind in (
      'tutorial', 'exercise', 'youtube', 'backing', 'reference', 'tab', 'other'
    ))
);

create index if not exists skill_resources_skill_idx
  on public.skill_resources (skill_id, position);

alter table public.skill_resources enable row level security;
revoke all on public.skill_resources from anon, authenticated;
grant all on public.skill_resources to service_role;
