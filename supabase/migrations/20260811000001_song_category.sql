-- Phase 11B — songs share Drift headings (user-named categories).
-- See docs/DECISIONS.md (2026-08-11, Phase 11B).

alter table public.songs
  add column if not exists category_id uuid
    references public.drift_lists (id) on delete set null;

create index if not exists songs_category_idx
  on public.songs (category_id)
  where category_id is not null;
