# Specs — one work unit at a time

A spec is a ticket the agent implements. It is not the project brain (`context/`) and not the philosophy (`docs/`).

## Numbering

`{phase}.{step}-{slug}.md` — same numbers as `context/roadmap-history.md`.

Examples: `12.54-tools-catalogue.md`, `12.55-chords.md`.

Do not backfill Phase 0–11 as spec files. That history stays in `context/roadmap-history.md`.

## Lifecycle

1. New scope → feature gate (`docs/GUARDRAILS.md`) → Rajon yes
2. Write spec from `_template.md` **before** code
3. Implement only that unit
4. Check “done when”
5. Move the file to `archive/`
6. Update `context/progress.md` and, if needed, `context/decisions.md`

## What a spec must list

- Context files to read
- Code files likely to change
- In / out of scope
- Done when (verifiable)
- Feature-gate result if the unit was new

## Archived (shipped)

- `archive/12.54-tools-catalogue.md`
- `archive/12.55-chords.md`
