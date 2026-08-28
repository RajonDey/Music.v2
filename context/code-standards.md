# Code standards

## General

- Keep modules single-purpose
- Fix root causes; do not layer workarounds
- Do not mix public tools and private Music OS in one change unless the spec says so
- Prefer small, verifiable increments (`context/ai-workflow.md`)

## TypeScript

- Strict mode
- Shared unions and labels live in `packages/types` — do not fork copies in the app
- Avoid `any`; validate unknown input at boundaries (`zod` in `lib/env.ts`)

## Next.js

- Default to server components
- `"use client"` only when the browser must interact
- `dynamic = "force-dynamic"` on private pages that read live Supabase
- Writes: server actions colocated with the route (`app/(private)/…/actions.ts`), or route handlers
- Never use the service role from client code
- `import "server-only"` on libs that must not leak to the client (`backup`, `coach-context`, `supabase` service client)

## Styling

- Tokens from `packages/tokens` only — no hardcoded hex in app components
- Semantic Tailwind: `bg-base`, `bg-card`, `text-primary`, `text-accent`, `font-display`, `border-border`, `stage-*`
- Primitives in `packages/ui` (Button, Card, Brand, SectionLabel, …). Feature UI stays in `apps/web/components`

## API routes

| Route | Gate |
|---|---|
| `POST /api/auth/login` | Public; sets cookie |
| `POST /api/coach` | Middleware cookie |
| `GET /api/backup` | Middleware cookie |
| `GET /api/cron/backup` | `CRON_SECRET` bearer/header — not the cookie |

Auth before any private mutation. Coach streams; missing Google key → 503 with a warm message, not a stack trace.

## File organization

| Path | Owns |
|---|---|
| `app/(public)/` | Public pages + public layout/header |
| `app/(private)/` | Music OS pages, layouts, server actions |
| `app/login/` | Gate UI |
| `app/api/` | Auth, coach, backup, cron |
| `components/session/` | Stand, riyaz, reflection, anchor picker |
| `components/songs/` | Song Room, Drift, diagrams |
| `components/skills/` | Lab, radar, scale reference, voice profile |
| `components/vocal/` | Range, warm-ups, confidence (used from Skills) |
| `components/report/` | Calendar, year, reflection, backup CTA |
| `components/coach/` | Coach panel |
| `components/public/` | Public chrome, JSON-LD, legal |
| `components/public-tools/` | Catalogue bodies + frame |
| `components/nav/` | Private rail / tabs |
| `components/tools/` | **Private** metronome (Studio), not the public shelf |
| `lib/` | Data loaders and engines (`practice`, `songs`, `stand`, `chords`, `public-tools`, …) |

## Data and storage

- Metadata and journals in Postgres
- Large media in `public/` (hero video, brand)
- Chord JSON via `@tombatossals/chords-db` in `lib/chords.ts` — keep heavy chord data off the client bundle where Song Room already server-renders diagrams

## Protected unless Rajon asks

- `.env` / secrets
- Applied migrations (add a new file)
- `_references/` prototypes (ideas only)
