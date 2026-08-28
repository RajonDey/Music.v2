# Public tools (as built)

Public shelf of musician **utilities**. Not gear, not Music OS, not skill-improvement gamification.

Private metronome stays in Studio (`components/tools/Metronome.tsx`). Song Room diagrams stay private. Gear stays on `/about#kit`.

## Rules

- Copy must never say “improve your skills”
- No drills, streaks, or padlocks
- No session / reflection / coach data
- No Chordify-style icon-tile feature grid
- No Music OS cookie required
- Adding a tool = registry row + body component + map in `bodies.ts` — no new nav, no new layout system
- Drafts (`status: "draft"`) never appear on `/tools` or in the sitemap

## Routes

- `/tools` — vertical setlist, title **At hand**
- `/tools/[slug]` — `ToolFrame` + body; unknown slug → warm `not-found`

## Live tools

| Slug | Name | Notes |
|---|---|---|
| `chords` | Chords | Default `C`; `?q=` for a committed name. Type + letter/spelling/quality. Engine `@tombatossals/chords-db` via `lib/chords.ts`. Public `VoicingDiagram` is separate from Song Room `ChordDiagram`. |

Work tickets (done): `specs/archive/12.54-tools-catalogue.md`, `specs/archive/12.55-chords.md`. Reference HTML (not the page): `_references/chord-finder.html`.

## How to ship another tool

1. Add `{ slug, name, lede, status: "live" }` in `lib/public-tools.ts`
2. Add `components/public-tools/{slug}.tsx`
3. Register in `components/public-tools/bodies.ts`

Sitemap and `llms.txt` read `getLiveTools()`.

## Entry points

- `lib/public-tools.ts`, `lib/chords.ts`
- `app/(public)/tools/`, `app/(public)/tools/[slug]/`
- `components/public-tools/`
