# Architecture

## Decision: one Next.js app, route groups, one deploy

One codebase, **one deployable Next.js app** at `apps/web` → **music.rajondey.com**.
Public home and private dashboard (Music OS) live in the same app, split by **route groups**
and protected by **middleware**. Shared packages hold design tokens, UI, and types.

This trades a hard deploy boundary for simplicity and trivial public↔private sync — the right
call when the public site is one page and the private area is a simple admin for the same domain.

```
Music.v2/
├── apps/
│   └── web/                         # Single app → music.rajondey.com
│       ├── app/
│       │   ├── (public)/
│       │   │   └── page.tsx         # / — public home
│       │   ├── (private)/
│       │   │   ├── layout.tsx       # Tab nav: Studio / Journey / Releases
│       │   │   ├── studio/page.tsx  # /studio
│       │   │   ├── journey/page.tsx # /journey
│       │   │   └── releases/page.tsx
│       │   ├── login/page.tsx       # Password gate (WeekOS pattern)
│       │   └── api/
│       │       └── coach/route.ts   # AI coach (streaming, middleware-protected)
│       ├── middleware.ts            # Protects (private) routes + private API
│       ├── components/
│       │   ├── session/  (IntentionBlock, ReflectionBlock, SessionLog)
│       │   ├── songs/    (SongCard, SongStage, AddSongModal)
│       │   └── coach/    (CoachChat, CoachMessage)
│       └── lib/          (supabase.ts, coach-prompt.ts, auth.ts, types re-export)
├── packages/
│   ├── tokens/            # Design tokens: CSS variables + Tailwind preset
│   ├── ui/                # Shared React primitives
│   ├── types/             # Shared TS types (SongStage, ComfortLevel, Session, …)
│   └── config/            # Shared tsconfig + lint config
├── supabase/
│   ├── migrations/        # SQL migrations (tables + RLS)
│   └── seed.sql
├── docs/
└── .cursor/rules/
```

## URL map

| URL | Who | What |
|---|---|---|
| `/` | Public | Home — bio, tagline, links, current song, latest share |
| `/tools` | Public | Musician-utility catalogue (not gear) |
| `/tools/[slug]` | Public | One utility; unknown slugs 404 |
| `/login` | Public | Password gate |
| `/studio` | Private | Today's session + AI coach |
| `/journey` | Private | Weekly reflection + session log |
| `/releases` | Private | Song tracker |
| `/api/coach` | Private | Streaming AI coach |
| `/api/backup` | Private | JSON notebook dump (cookie) |
| `/api/cron/backup` | Cron | Monthly email of the same dump (`CRON_SECRET`) |

No `/admin` prefix — short paths for mobile logging after practice. Middleware is the gate.

## Notebook backup (Phase 10)

A versioned JSON dump (`{ version: 1, app: "music-os", exported_at, tables }`) of every
user table, built in `apps/web/lib/backup.ts`. Download from Report or receive it by email
on the 1st of each month. The file is the product — there is no in-app restore. If data is
lost, hand the JSON to an agent and write a one-off import. Do not overwrite a live database
from an old file without a deliberate, reviewed step.

Public `/` never reads this dump. Cron is secret-gated, not cookie-gated (Vercel Cron has
no session). The monthly email is a private copy of reflections and coach chat — treat the
inbox as sensitive.

## Auth (middleware + WeekOS pattern)

1. User hits `/login`, enters `MUSIC_OS_PASSWORD`.
2. On success, set an **httpOnly cookie** (e.g. `music_os_unlock`) — server-verifiable by middleware.
   Optionally mirror unlock state in localStorage for UX, but **middleware trusts the cookie only**.
3. `middleware.ts` allows `/`, `/login`, static assets, and public API routes through.
4. Everything under `(private)` and private `/api/*` requires the cookie; else redirect to `/login`.
5. Cookie lifetime ~1 year (match WeekOS “unlocks this browser” feel).

Never expose `SUPABASE_SERVICE_ROLE_KEY` or `GOOGLE_GENERATIVE_AI_API_KEY` to the client.

## Tooling

- **Package manager:** pnpm workspaces + **Turborepo** (one app + shared packages).
- **Framework:** Next.js 14+ App Router, TypeScript strict, RSC by default.
- **Styling:** Tailwind via `packages/tokens` preset — semantic utilities, no raw hex in app code.
- **Data:** Supabase (Postgres), RLS from day one. All writes server-side.
- **AI:** Google `gemini-2.5-flash` (AI Studio free tier) via Vercel AI SDK.

## Deploy (Vercel)

**One Vercel project**, root directory `apps/web`, custom domain **music.rajondey.com**.
No second deploy. Public and private ship together — acceptable because middleware enforces
the boundary and the public surface is tiny.

## Sync model (Phase 4 — much simpler now)

Public `/` reads published data directly from the same Supabase (or server components):
- `songs` where `is_shared = true` or stage = `shared` → “latest release”
- Current learning song → a flagged field or most recent active song

No cross-app API. Same codebase, same queries, different route groups.

## Security checklist (non-negotiable with one app)

- Middleware on every private route and private API — no exceptions.
- Coach API and all Supabase writes: server-only, behind auth cookie check.
- Public `(public)` pages: never import or render private session/reflection data.
- RLS on all tables; service role only on the server.
