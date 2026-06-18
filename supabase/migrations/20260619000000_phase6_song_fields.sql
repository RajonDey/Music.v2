-- Phase 6 — additive song fields for regional lyrics, Studio focus, capo.
-- See docs/ROADMAP.md Phase 6 step 23.

alter table public.songs add column if not exists lyrics_text text;
alter table public.songs add column if not exists is_pinned boolean not null default false;
alter table public.songs add column if not exists capo int
  check (capo is null or (capo >= 0 and capo <= 12));

create index if not exists songs_pinned_idx on public.songs (is_pinned)
  where is_pinned = true;
