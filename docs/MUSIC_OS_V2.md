# Music OS v2 — Depth (system design)

> Status: **approved plan, not yet built** (2026-06-18). Phase 5 in `docs/ROADMAP.md`.
> Metric/chart guardrails are explicitly overridden for this phase — see `docs/DECISIONS.md`.
> This document supersedes the 3-tab spec in `PROJECT_BRIEF.md` for the private OS, and
> extends `DATA_MODEL.md` (merge into it when migrations are written).

---

## 1. The idea in one line

Five connected screens, one shared data spine. **You log practice once in the Practice Room;
that single log fans out automatically into the Song Room, Skills Lab, Vocal Studio, and
Monthly Report.** You never enter the same thing twice.

```
Practice Room  ──(daily log)──┐
   │  deep-links               ├─► Song Room      (per-song notebook + practice log)
   │                           ├─► Skills Lab     (skill evidence + radar)
   ▼                           ├─► Vocal Studio   (range, warmups, confidence)
 hub you open every morning    └─► Monthly Report (calm monthly retrospective)
```

- **Practice Room** — the hub. Opened daily. Short, low-friction.
- **Song Room** — destination for deep song work. ~1–2×/week.
- **Skills Lab** — destination for skill tracking. ~1–2×/week.
- **Vocal Studio** — opened during the singing part of practice.
- **Monthly Report** — a once-a-month ritual.

---

## 2. Navigation / information architecture

The current nav (Studio / Journey / Releases) is **retired**. New private nav:

| Order | Tab | Route | Replaces | Cadence |
|---|---|---|---|---|
| 1 | Practice Room | `/practice` (or keep `/studio`) | Studio | daily |
| 2 | Song Room | `/songs`, `/songs/[id]` | Releases | weekly |
| 3 | Skills Lab | `/skills` | — (new) | weekly |
| 4 | Vocal Studio | `/vocal` | — (new) | per-session |
| 5 | Monthly Report | `/report` | Journey (weekly) | monthly |

- The weekly **Journey** tab is removed. Weekly reflection is dropped in favor of a daily layer
  (Practice Room) + monthly layer (Monthly Report). The monthly reflection lives in the Report.
- **Route naming decision (open):** keep `/studio` for muscle memory, or move to `/practice`.
  Default recommendation: rename to `/practice` and redirect `/studio` → `/practice`.
- Coach stays **always visible** (principle #6) — present in Practice Room, optionally a
  floating launcher on other screens.

---

## 3. Data model (v2)

Single-user, RLS on every table, service-role server writes only (unchanged security model).
`+` = new column on an existing table. New tables marked **(new)**.

### 3.1 `songs` (extend)
| column | type | notes |
|---|---|---|
| …existing… | | id, created_at, name, artist, notes, why_this_song, target, last_worked_at, is_shared |
| + `key` | text | musical key, e.g. "G major" (manual or MusicBrainz) |
| + `bpm` | int | tempo (manual or API; see §6 caveat) |
| + `time_signature` | text | e.g. "4/4" |
| + `learning_stage` | text | pipeline below; **primary progress axis** |
| `stage` | text | keep as coarse shelf state for public sync (`is_shared`) |
| `comfort_level` | text | **deprecated** in v2 UI; keep column for back-compat |

**Learning-stage pipeline** (states, not deadlines; each move timestamped in `song_stage_log`):
`chords_learned → can_play_through → singing_added → chords_singing_together → rough_take → complete`

`complete` moves the song to the **Completed Shelf** (performance library).

### 3.2 `song_parts` **(new)** — structure / parts map
| column | type | notes |
|---|---|---|
| id | uuid pk | |
| song_id | uuid fk → songs | cascade delete |
| position | int | order in the song |
| name | text | Intro / Verse / Pre-chorus / Chorus / Bridge / Outro / custom |
| chords | text | progression for this part (free text, e.g. "Am F C G") |
| notes | text | "capo 2", "strum changes here" |

### 3.3 `song_resources` **(new)** — resources dock
| column | type | notes |
|---|---|---|
| id | uuid pk | |
| song_id | uuid fk → songs | |
| position | int | |
| label | text | display name |
| url | text | link |
| kind | text | `youtube` / `backing` / `reference` / `tab` / `other` |

### 3.4 `song_stage_log` **(new)** — timestamped pipeline moves
| column | type | notes |
|---|---|---|
| id | uuid pk | |
| song_id | uuid fk → songs | |
| from_stage | text | nullable (first entry) |
| to_stage | text | |
| changed_at | timestamptz default now() | powers Monthly Report "wins" |

### 3.5 `sessions` (extend — stays the emotional spine)
Keep all existing fields (intention, feeling_before, what_worked_on, what_felt_better,
what_felt_stuck, quality_rating, started_at, logged_at). The single `song_id` is superseded by
the `session_songs` join (keep the column nullable for back-compat / "primary song").

### 3.6 `session_songs` **(new)** — which songs a session touched
| column | type | notes |
|---|---|---|
| id | uuid pk | |
| session_id | uuid fk → sessions | cascade |
| song_id | uuid fk → songs | |

→ Drives each Song Room's **auto practice log** ("worked on this 14× over 3 weeks").

### 3.7 `session_skills` **(new)** — which skills/actions a session touched
| column | type | notes |
|---|---|---|
| id | uuid pk | |
| session_id | uuid fk → sessions | cascade |
| skill_id | uuid fk → skills | |
| note | text | optional ("figured out the bridge by ear") |

→ Feeds Skills Lab. Certain skills (e.g. Ear Training) **auto-create a `skill_moment`** on tag.

### 3.8 `skills` **(new)** — the catalogue (seeded from the 80+ list)
| column | type | notes |
|---|---|---|
| id | uuid pk | |
| category | text | one of the 11 categories |
| name | text | e.g. "Barre chords" |
| tier | text | `milestone` / `progress` / `evergreen` |
| radar_axis | text | Rhythm / Chords / Theory / Lead / Performance / Ear |
| position | int | display order |

### 3.9 `skill_states` **(new)** — current state per skill (one row each)
| column | type | notes |
|---|---|---|
| id | uuid pk | |
| skill_id | uuid fk → skills | unique |
| milestone_done | boolean default false | for `milestone` tier |
| progress_value | int | 1–5, for `progress` tier (override-approved) |
| updated_at | timestamptz | |

### 3.10 `skill_moments` **(new)** — evidence log + auto-capture
| column | type | notes |
|---|---|---|
| id | uuid pk | |
| skill_id | uuid fk → skills | nullable for general moments |
| session_id | uuid fk → sessions | nullable |
| note | text | "today I worked out a progression by ear" |
| created_at | timestamptz default now() | |

### 3.11 `skill_snapshots` **(new)** — monthly radar history (for month-vs-month overlay)
| column | type | notes |
|---|---|---|
| id | uuid pk | |
| month_label | text | "2026-06" |
| axis | text | one of the six |
| value | numeric | 0–5 computed score (see §4.3) |

### 3.12 Vocal tables **(new)**
`vocal_range` — id, low_note (text "C3"), high_note (text "A4"), measured_at.
`vocal_warmups` — id, position, name, duration_seconds, active. (the fixed routine, step rows)
`vocal_exercises` — id, position, label, url, problem_tag ("flat on chorus"). (the dock)
`vocal_logs` — id, session_id (nullable), date, confidence int 1–5, voice_day text
(`good`/`okay`/`rough`), note. → confidence trend line + variance explanation.

### 3.13 `monthly_reflections` **(new)** — replaces weekly_reflections role
| column | type | notes |
|---|---|---|
| id | uuid pk | |
| month_label | text unique | "2026-06" |
| reflection | text | "What's different about my playing vs last month?" |
| created_at | timestamptz | |

`weekly_reflections` — **deprecated** (kept until a cleanup migration).
`coach_messages` — unchanged (coach context expands in a later step to read v2 data).

---

## 4. Screen specs

### 4.1 Practice Room (`/practice`) — the daily hub
Evolves the current Studio. Stays short and low-friction.
- **Intention block** (existing): focus + feeling chips (nervous/neutral/excited) + Start Session.
- **Reflection block** (existing): what you worked on / what felt better / what felt stuck +
  quality word (unfocused → in the zone) + Log Session.
- **NEW — what did you touch today?** multi-select of current songs (→ `session_songs`) and a
  quick skill tagger (→ `session_skills`). Framed as *retrospective tagging of what you did*,
  not a checklist to complete.
- **Deep links:** the song picker links into that song's Song Room; tapping a skill links into
  its Skills Lab entry.
- **Coach chat** below, always visible (existing).

### 4.2 Song Room (`/songs`, `/songs/[id]`)
The most powerful screen — a dedicated notebook per song.
- **Header** — name, artist, key, BPM, time signature (fill once; API autofill later).
- **Parts map** — collapsible sections from `song_parts`; each part shows chord progression +
  notes. Add/reorder/edit parts.
- **Chord diagrams** — rendered inline from the static chords-db dataset (client-side; no key).
- **Learning-stage pipeline** — tap to advance through the 6 stages; each tap writes
  `song_stage_log`. "Complete" ≠ binary; it's the end of a multi-week ladder.
- **Practice log** — auto from `session_songs`: "14 sessions over 3 weeks", reverse-chron list.
- **Resources dock** — 2–3 saved links (YouTube, backing track, reference).
- **Completed Shelf** — list view of `learning_stage = complete` songs; your performance library.

### 4.3 Skills Lab (`/skills`)
Seeded from the 80+ skills across 11 categories. Three tiers:
- **Milestone** — binary; confirm once, green forever (`skill_states.milestone_done`).
- **Progress** — 1–5 self-rating, updated occasionally (`skill_states.progress_value`).
- **Evergreen** — never "done"; you log dated **moments** (`skill_moments`) as evidence.

**Ear-training auto-capture:** tagging an ear-related action in the Practice Room (e.g.
"learned by ear", "played along to a backing track") auto-creates a `skill_moment` on the Ear
Training skill — it tracks itself through behavior.

**Radar chart — six axes:** Rhythm · Chords · Theory · Lead · Performance · Ear.
- **Category → axis mapping:** Rhythm←(1 Rhythm & Timing); Chords←(2 Chords);
  Theory←(3 Fretboard, 4 Scales & Modes, 7 Music Theory, 8 Reading & Notation);
  Lead←(5 Lead Techniques, 6 Improvisation); Performance←(9 Repertoire & Performance,
  10 Technical & Physical); Ear←(11 Ear & Creativity).
- **Axis score (0–5), tunable formula:** average over the axis's skills of —
  milestone: `done ? 5 : 0`; progress: `progress_value`; evergreen: `min(5, moments_count / K)`
  (start K≈3). Stored monthly in `skill_snapshots`.
- Month-vs-month overlay shown here and in the Monthly Report (override-approved).

### 4.4 Vocal Studio (`/vocal`)
- **Range tracker** — low/high comfortable note → rendered on a visual keyboard; history from
  `vocal_range`.
- **Warm-up routine** — fixed tappable checklist (lip trills → humming → "ma" scales → passage),
  each step with a duration (`vocal_warmups`).
- **Exercises dock** — curated YouTube links tagged by problem (`vocal_exercises`).
- **Confidence log** — 1–5 slider after singing sessions (override-approved) → trend line.
- **Voice-day tag** — good / okay / rough, to explain variance without "failing".
- **Pitch visualiser** — Web Audio API autocorrelation: sing a note → note name + flat/sharp
  cents. Self-awareness tool, not a tuner-grade product. **Final sub-step** of this screen.

### 4.5 Monthly Report (`/report`)
Monthly, calm, retrospective.
- **Top: three numbers** — sessions this month, songs touched (distinct `session_songs`),
  recordings made (`song_stage_log` → rough_take/recorded this month).
- **Practice calendar** — full month grid.
- **Skills snapshot** — radar this month vs last (`skill_snapshots` overlay).
- **Songs moved a stage** — concrete wins from `song_stage_log` (e.g. "Knockin' → rough take").
- **Vocal confidence trend** — line from `vocal_logs` (shape only).
- **Year view** — 12 columns, session count per month.
- **Monthly reflection** — one text field, saved to `monthly_reflections`, scrollable history.

---

## 5. The data-flow contract (build this first, get it right)

One Practice Room log writes, in a single server action:
1. `sessions` row (emotional record).
2. `session_songs` rows → each linked Song Room's practice log + `songs.last_worked_at`.
3. `session_skills` rows → Skills Lab; ear-type tags also insert `skill_moments`.
4. optional `vocal_logs` row if the session included singing.

Everything else is a **read/derived view** over these tables. No screen re-asks for data another
screen already captured. Stage moves and skill ratings are the only writes that happen *outside*
the daily log (done deliberately in Song Room / Skills Lab).

---

## 6. Free APIs (manual-first, layer last)

| Purpose | Source | Notes / caveats |
|---|---|---|
| Song metadata (artist, work) | MusicBrainz | Free, no key. **Caveat:** reliable for artist/title/work, **not** for key/BPM (that was AcousticBrainz, now read-only/maintenance). Treat key/BPM as manual; investigate GetSongBPM/Tunebat if we want autofill. |
| Chord diagrams | chords-db (static JSON) | Bundle client-side; type "Am" → fingering. No key needed. |
| Lyrics (reference) | lyrics.ovh | Free, no key. By artist + title. |
| Backing tracks | YouTube links (manual) | Stored in `song_resources`. |
| Pitch detection | Web Audio API | Built-in; autocorrelation. Browser mic permission. |
| Notation basics | VexFlow | Free JS lib; optional, render parts as notation later. |

**Principle:** no screen's first version depends on an external API being up. Manual entry
ships first; APIs are enrichment.

---

## 7. Build sequence (Phase 5 steps — strict order)

1. **Schema + data-flow engine** — migrations for all new tables + `songs` columns + RLS + seed
   (skills catalogue from the 80+ list; keep Dylan song). Shared types in `packages/types`.
2. **Song Room** — full notebook, manual entry, chords-db diagrams. Highest value, no metric risk.
3. **Practice Room** — evolve Studio; multi-song/skill tagging fan-out; deep links.
4. **Skills Lab** — tiers, moments, ear auto-capture, radar + monthly snapshot job.
5. **Vocal Studio** — range/warmups/exercises/confidence/voice-day; pitch visualiser last.
6. **Monthly Report** — counts, calendar, radar overlay, stage-move wins, trend, year view,
   reflection.
7. **API enrichment** — MusicBrainz autofill, lyrics.ovh, VexFlow.
8. **Nav/IA redesign + Hallmark audit** — new private nav, retire Journey, design pass on all
   screens, mobile-first check.

Each step: `pnpm lint` + `pnpm typecheck` clean, RLS intact, secrets server-side.

---

## 8. Open questions to resolve at build time

1. **Route names** — `/studio` → `/practice`? `/releases` → `/songs`? (recommend rename + redirect).
2. **Song progress axes** — confirm `learning_stage` becomes primary and `comfort_level` is
   dropped from UI; what does the coarse `stage` (discovering→shared) now mean vs the pipeline?
3. **Skill tagging UX** — how the Practice Room exposes 80+ skills without friction (recent/
   favorited skills surfaced; full list searchable).
4. **Radar formula constants** — tune K (evergreen scaling) and milestone weighting after seeing
   real data; the §4.3 formula is a starting point.
5. **Key/BPM source** — accept manual-only for v2, or add a BPM API in step 7.
6. **Coach context** — when do we expand the coach prompt to read Song Room / Skills / Vocal data?
