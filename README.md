# Rajon Dey — Music

One Next.js app at **music.rajondey.com**: a warm public home at `/` and a private Music OS
admin at `/studio`, `/journey`, `/releases` — same deploy, split by route groups + middleware.

**Not a habit tracker.** No streaks, no scores. Confidence-first.

## Status

**Phase 0 in progress** — page shells, GitHub, Vercel. Scaffold (step 1) done.

See **`docs/GETTING_STARTED.md`** to run locally (env + Supabase migration).

- `docs/GUARDRAILS.md` — feature gate, phase rules, skills
- `docs/` — brief, architecture, design, data, roadmap
- `.cursor/rules/` — enforced guardrails
- `.agents/skills/` — Hallmark + Supabase Postgres best practices

## Stack

Next.js 14+ · TypeScript · Tailwind (shared tokens) · Supabase · Anthropic (streaming) ·
Turborepo + pnpm · one Vercel deploy.

## Start here

1. `docs/PROJECT_BRIEF.md` — philosophy + features
2. `docs/ARCHITECTURE.md` — single-app layout + middleware auth
3. `docs/ROADMAP.md` — build phases
