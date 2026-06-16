# Data Model (Supabase / Postgres)

Single-user app, but **RLS is enabled from day one**. Access is via the server using the
service role key behind the password gate; the anon client is read-restricted. Keep all
writes server-side (route handlers / server actions).

## Tables

### `songs`
| column | type | notes |
|---|---|---|
| id | uuid pk default gen_random_uuid() | |
| created_at | timestamptz default now() | |
| name | text not null | |
| artist | text | |
| stage | text not null default 'discovering' | enum-like: discovering / learning / comfortable / recorded / shared |
| comfort_level | text default 'not_comfortable' | not_comfortable / getting_there / comfortable / ready_to_record |
| notes | text | |
| why_this_song | text | optional |
| target | text | optional, no deadline pressure |
| last_worked_at | timestamptz | auto-updated from sessions |
| is_shared | boolean default false | drives future public sync |

### `sessions`
| column | type | notes |
|---|---|---|
| id | uuid pk default gen_random_uuid() | |
| created_at | timestamptz default now() | |
| date | date not null default current_date | |
| song_id | uuid references songs(id) on delete set null | null = freestyle |
| intention | text | session focus |
| feeling_before | text | nervous / neutral / excited |
| what_worked_on | text | |
| what_felt_better | text | |
| what_felt_stuck | text | optional |
| quality_rating | int check (quality_rating between 1 and 5) | quality, NOT time |
| started_at | timestamptz | set on "Start Session" |
| logged_at | timestamptz | set on "Log Session" |

### `weekly_reflections`
| column | type | notes |
|---|---|---|
| id | uuid pk default gen_random_uuid() | |
| created_at | timestamptz default now() | |
| week_label | text not null unique | ISO week, e.g. "2026-W25" |
| focus_song | text | this week's focus song/skill |
| focus_feeling | text | "what do you want to feel by end of week?" |
| what_felt_hard | text | |
| what_felt_good | text | |
| tiny_win | text not null | required before submit |
| do_differently | text | optional |

### `coach_messages`
| column | type | notes |
|---|---|---|
| id | uuid pk default gen_random_uuid() | |
| created_at | timestamptz default now() | |
| role | text not null check (role in ('user','assistant')) | |
| content | text not null | |
| session_date | date default current_date | groups chat per day/session |

## RLS

Enable RLS on every table. Since there is no per-user auth (single password gate), the
practical model is: **service-role server access only**; deny anon writes. Document a clear
policy per table (e.g. `enable row level security; revoke all on table from anon;` and grant
through the service role used by server routes). Never expose the service role key to the client.

## Triggers / derived data

- `songs.last_worked_at` updates whenever a session referencing that song is logged
  (trigger on `sessions` insert/update, or set in the server action).

## Seed

`supabase/seed.sql` pre-loads: **"Knockin' on Heaven's Door" — Bob Dylan** (stage `learning`).
