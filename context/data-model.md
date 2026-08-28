# Data model

Single-user app, **RLS on every table**. Access is the service role on the server behind the password gate. Anon must not write. Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client.

Canonical types: `packages/types`. Schema lives in `supabase/migrations/` (additive only — do not rewrite applied migrations).

Public routes **must not** select: `sessions`, `weekly_reflections`, `monthly_reflections`, `coach_messages`, vocal logs, skill moments, or other practice diary rows.

## Core journal

| Table | Purpose |
|---|---|
| `songs` | Notebooks. Coarse `stage` (discovering→shared), `learning_stage` pipeline, `comfort_level` (kept; UI de-emphasised), `is_shared`, `is_pinned`, `capo`, `lyrics_text`, `category_id` → `drift_lists`, key/bpm/time_signature, `last_worked_at` |
| `sessions` | Emotional spine. `practice_kind` `riyaz` \| `session`. Anchors: `anchor_type` song / guitar_skill / vocal / freestyle; `anchor_skill_id`; `song_focus`; `riyaz_feel`. Intention, feeling_before, reflection fields, `quality_rating` 1–5 (quality words in UI, not a scoreboard), `started_at` / `logged_at` |
| `weekly_reflections` | Legacy weekly journal. Kept; Report uses `monthly_reflections`. Coach may fall back to last tiny win |
| `coach_messages` | `user` \| `assistant`, grouped by `session_date` |

## Song Room

| Table | Purpose |
|---|---|
| `song_parts` | Parts map (chords text + notes) |
| `song_resources` | Links dock |
| `song_stage_log` | Timestamped `learning_stage` moves (Report “wins”) |
| `session_songs` | Which songs a full session touched (auto practice log) |

Learning stages: `chords_learned` → `can_play_through` → `singing_added` → `chords_singing_together` → `rough_take` → `complete` (Completed Shelf).

## Drift (not songs until promoted)

| Table | Purpose |
|---|---|
| `drift_lists` | Named pockets; also the shared category system (`songs.category_id`) |
| `drift_items` | Title and/or URL; `promoted_song_id` after “start a notebook” |

Studio, pins, coach, and report **ignore** drift items. Seed headings include **Noticed** (deletable set also includes Classic covers, Hangouts, Rabindra & Nazrul).

## Skills Lab

| Table | Purpose |
|---|---|
| `skills` | Catalogue. `domain` guitar \| vocal; unique `(domain, category, name)`; tier milestone / progress / evergreen; radar axis |
| `skill_states` | Per-skill state + `practice_note` |
| `skill_resources` | Per-skill links (Stand shows top few) |
| `skill_moments` | Evidence log; ear-type tags can auto-insert |
| `session_skills` | Skills tagged on a session |
| `skill_snapshots` | Monthly radar points (`domain` for guitar vs vocal overlay) |

## Vocal (profile on Skills, not its own nav tab)

| Table | Purpose |
|---|---|
| `vocal_range` | Low/high notes + measured_at |
| `vocal_warmups` | Fixed routine steps |
| `vocal_exercises` | Dock links |
| `vocal_logs` | Confidence 1–5 + voice-day good/okay/rough (override-approved; not a public score) |

## Report

| Table | Purpose |
|---|---|
| `monthly_reflections` | One prose field per `month_label` |

Calendar on Report = **sessions only**, not riyaz.

## Backup dump tables

Same list as `BACKUP_TABLES` in `apps/web/lib/backup.ts`: songs + song_* + sessions + session_* + weekly/monthly reflections + coach_messages + skills* + vocal_* + drift_*.

## Triggers / derived

`songs.last_worked_at` updates when a session referencing that song is logged.

## Seed

`supabase/seed.sql` includes **Knockin' on Heaven's Door — Bob Dylan** and the skills catalogues (guitar ~110, vocal ~83). Drift seed: empty **Noticed** plus category names from later migrations.

## Migrations (order)

`20260616` initial → `20260618` v2 → `20260619` song lyrics/pin/capo → `20260623` session anchors → `20260624` skill resources → `20260625` skill domain → `20260626` practice_kind → `20260811` drift → song category → seed categories.
