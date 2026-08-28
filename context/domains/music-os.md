# Music OS (as built)

Private practice journal. Intention and feeling, not a scorecard. Nav: **Studio · Songs · Skills · Report**.

`.cursor/rules/30-music-os.mdc` still names Journey / Releases — ignore that IA.

## Surfaces

| Route | Job |
|---|---|
| `/studio` | Daily hub. Riyaz entry, continue/pinned songs, anchor picker. Open session → fullscreen Stand → reflection. Coach + private metronome when idle. |
| `/studio/session/[id]` | Edit a logged session |
| `/songs` | Two tabs: **Songs List** (Drift pockets) and **Songs Notebook** (growing + completed shelf). Shared categories as dropdown + headings. |
| `/songs/[id]` | One notebook: header, parts map, chord diagrams, lyrics, resources, learning-stage pipeline, practice log from `session_songs` |
| `/skills` | Guitar \| Vocal tabs. Radar, catalogue, moments. Vocal tab also **Voice profile** (`#voice`): range, warm-ups, exercises, confidence log |
| `/skills/[id]` | Skill notebook: practice note + resources |
| `/report` | Month counts (sessions vs riyaz), calendar (sessions only), radar overlay, stage-move wins, vocal trend, year view, monthly reflection, **Keep a copy** |
| `/vocal` | Redirect → `/skills?tab=vocal#voice` |
| `/releases` | Redirect → `/songs` |
| `/journey` | Redirect → `/report` |

## Daily flow

1. **Riyaz** (`practice_kind = riyaz`) — morning vocal or guitar; end with optional feel chip. Light, not a full Stand.
2. **Session** — one anchor: song / guitar_skill / vocal / freestyle. Stand is read-only material (parts, lyrics, chords, skill note/links, warm-ups). End session → reflection; tags fan out to `session_songs` / `session_skills`.
3. Coach is on Studio, always available when not in Stand.

Do not re-ask in Song Room or Skills for data the daily log already captured. Stage moves and skill ratings are the writes that happen *outside* the daily log.

## What this area is not

- Habit tracker (streaks, quotas, “you missed a day”)
- Weekly OS
- A fifth nav tab for Vocal

## Entry points

- Pages: `app/(private)/{studio,songs,skills,report}/`
- Actions: `app/(private)/{studio,songs,skills,vocal,report,coach}/actions.ts` + `songs/drift-actions.ts`
- Loaders: `lib/practice.ts`, `session.ts`, `stand.ts`, `songs.ts`, `drifts.ts`, `skills.ts`, `vocal.ts`, `report.ts`
- Nav: `components/nav/navItems.tsx`, `PrivateNav.tsx`, `NavRail.tsx`
