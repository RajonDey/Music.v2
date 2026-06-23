-- Phase 7 / Execution mode: session anchors for Stand UI.
-- Additive only — existing sessions backfilled from song_id.

alter table public.sessions
  add column if not exists anchor_type text
    check (anchor_type is null or anchor_type in ('song', 'guitar_skill', 'vocal', 'freestyle')),
  add column if not exists anchor_skill_id uuid references public.skills(id) on delete set null,
  add column if not exists song_focus text
    check (song_focus is null or song_focus in ('guitar', 'vocal', 'both'));

create index if not exists sessions_anchor_skill_id_idx on public.sessions (anchor_skill_id);

-- Backfill from legacy song_id column.
update public.sessions
set anchor_type = 'song'
where song_id is not null and anchor_type is null;

update public.sessions
set anchor_type = 'freestyle'
where song_id is null and anchor_type is null;
