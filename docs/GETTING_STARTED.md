# Getting started

## 1. Prerequisites

- Node 20+
- pnpm 9 (`corepack enable && corepack prepare pnpm@9.15.9 --activate`)
- Supabase project (free tier is fine)

## 2. Install

```bash
pnpm install
```

## 3. Environment

Copy env to the **repo root** (recommended) or `apps/web/.env.local`:

```bash
cp .env.example .env
# or: cp .env.example apps/web/.env.local
```

Fill in:

- `MUSIC_OS_PASSWORD` — your private gate password
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_GENERATIVE_AI_API_KEY` — optional; coach returns 503 without it
- `RESEND_API_KEY`, `BACKUP_EMAIL`, `CRON_SECRET` — optional until monthly backup email

## 4. Supabase

Apply migrations in `supabase/migrations/` in timestamp order, then `supabase/seed.sql`
(Supabase CLI or dashboard SQL editor).

## 5. Run

```bash
pnpm dev
```

- Public: http://localhost:3000
- Login: http://localhost:3000/login
- After unlock: http://localhost:3000/studio

## 6. Verify

```bash
pnpm typecheck
pnpm lint
```

## What lives where

| Path | Purpose |
|---|---|
| `AGENTS.md` | Agent navigator |
| `docs/` | Philosophy, gates, this file |
| `context/` | As-built system |
| `specs/` | Work units |
| `packages/types` | Shared TS |
| `packages/tokens` | CSS variables + Tailwind preset |
| `packages/ui` | Button, Card, Brand, … |
| `packages/config` | Shared tsconfig base |
| `apps/web` | Next.js app |
| `supabase/` | Migrations + seed |

Layout detail: `context/architecture.md`. New ideas → **feature gate** (`docs/GUARDRAILS.md`).
