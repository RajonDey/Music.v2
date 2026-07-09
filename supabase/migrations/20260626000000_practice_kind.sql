-- Phase 9: Two rhythms — riyaz (morning warm-up) vs full session.

alter table public.sessions
  add column if not exists practice_kind text not null default 'session'
    check (practice_kind in ('riyaz', 'session')),
  add column if not exists riyaz_feel text
    check (
      riyaz_feel is null
      or riyaz_feel in ('good', 'okay', 'rough', 'loose', 'normal', 'tight')
    );

create index if not exists sessions_practice_kind_date_idx
  on public.sessions (practice_kind, date);

-- Existing rows are full sessions.
update public.sessions set practice_kind = 'session' where practice_kind is null;
