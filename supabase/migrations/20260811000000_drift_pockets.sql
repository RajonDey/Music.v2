-- Phase 11 — Drift: named listening pockets (not songs until promoted).
-- See docs/DATA_MODEL.md and docs/DECISIONS.md (2026-08-11).

create table if not exists public.drift_lists (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  position int not null default 0
);

create unique index if not exists drift_lists_name_lower_idx
  on public.drift_lists (lower(name));

create index if not exists drift_lists_position_idx
  on public.drift_lists (position, created_at);

create table if not exists public.drift_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  list_id uuid not null references public.drift_lists (id) on delete cascade,
  title text,
  url text,
  promoted_song_id uuid references public.songs (id) on delete set null,
  constraint drift_items_title_or_url check (
    (title is not null and length(btrim(title)) > 0)
    or (url is not null and length(btrim(url)) > 0)
  )
);

create index if not exists drift_items_list_idx
  on public.drift_items (list_id, created_at);

create index if not exists drift_items_open_idx
  on public.drift_items (list_id)
  where promoted_song_id is null;

create index if not exists drift_items_promoted_song_idx
  on public.drift_items (promoted_song_id)
  where promoted_song_id is not null;

alter table public.drift_lists enable row level security;
alter table public.drift_items enable row level security;

revoke all on public.drift_lists from anon, authenticated;
revoke all on public.drift_items from anon, authenticated;

grant all on public.drift_lists to service_role;
grant all on public.drift_items to service_role;

insert into public.drift_lists (name, position)
select 'Noticed', 0
where not exists (
  select 1 from public.drift_lists where lower(name) = 'noticed'
);
