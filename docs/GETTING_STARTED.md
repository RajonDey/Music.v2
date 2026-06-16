# Getting started

Phase 1 scaffold is in place. Follow this order.

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
- `ANTHROPIC_API_KEY` — optional until coach (step 4)

## 4. Supabase

Apply migration + seed (Supabase CLI or dashboard SQL editor):

- `supabase/migrations/20260616000000_initial_schema.sql`
- `supabase/seed.sql`

## 5. Run

```bash
pnpm dev
```

- Public stub: http://localhost:3000
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
| `packages/types` | SongStage, Session, CoachContext — shared TS |
| `packages/tokens` | CSS variables + Tailwind preset |
| `packages/ui` | Button, Card, Field primitives |
| `packages/config` | Shared tsconfig base |
| `apps/web` | Next.js app (public + private routes) |
| `supabase/` | Migrations + seed |

## Next roadmap steps

1. ✅ Phase 1 step 1 — scaffold (this)
2. Phase 1 step 2 — Studio intention + reflection → Supabase
3. Phase 1 step 3 — Releases song CRUD
4. Phase 1 step 4 — AI coach streaming
5. Phase 1 step 5 — Journey weekly reflection

New ideas → run the **feature gate** (`docs/GUARDRAILS.md`).
