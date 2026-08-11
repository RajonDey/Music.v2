-- Phase 11B — starter categories Rajon can keep, rename by re-adding, or delete.
-- Safe to re-run.

insert into public.drift_lists (name, position)
select 'Classic covers', 1
where not exists (
  select 1 from public.drift_lists where lower(name) = 'classic covers'
);

insert into public.drift_lists (name, position)
select 'Hangouts', 2
where not exists (
  select 1 from public.drift_lists where lower(name) = 'hangouts'
);

insert into public.drift_lists (name, position)
select 'Rabindra & Nazrul', 3
where not exists (
  select 1 from public.drift_lists where lower(name) = 'rabindra & nazrul'
);
