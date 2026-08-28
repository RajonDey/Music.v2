# Rajon Dey — Music

One Next.js app at **music.rajondey.com**: a warm public home at `/` and a private Music OS
at `/studio`, `/songs`, `/skills`, `/report` — same deploy, split by route groups + middleware.

**Not a habit tracker.** No streaks, no scores. Confidence-first.

**Agents:** start at `AGENTS.md`. As-built memory is `context/`. Specs go in `specs/`. `docs/` is philosophy, gates, and how to run locally.

## Status

Music OS through Drift + public **Tools** (Chords) is in the app. No next product step is green-lit.

See **`docs/GETTING_STARTED.md`** to run locally (env + Supabase migration).

- `AGENTS.md` — navigator
- `context/` — as-built architecture, data, UI, domains
- `docs/GUARDRAILS.md` — feature gate
- `.cursor/rules/` — always-on vetoes
- `.agents/skills/` — Hallmark + Supabase Postgres best practices

## Stack

Next.js 14+ · TypeScript · Tailwind (shared tokens) · Supabase · Gemini (streaming coach) ·
Turborepo + pnpm · one Vercel deploy.

## Start here

1. `docs/PROJECT_BRIEF.md` — philosophy
2. `context/architecture.md` — current layout + auth
3. `context/progress.md` — where we are
