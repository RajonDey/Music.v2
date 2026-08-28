# Architecture context

One codebase, **one deployable Next.js app** at `apps/web` → **music.rajondey.com**. Public home and Music OS share the deploy, split by **route groups** and **middleware**. Shared packages hold tokens, UI primitives, and types.

## Stack

| Layer | Technology | Role |
| --- | --- | --- |
| App | Next.js App Router + TypeScript strict | RSC by default; `apps/web` |
| Monorepo | pnpm workspaces + Turborepo | One app + `packages/*` |
| UI | Tailwind via `@music/tokens` | Semantic utilities; no raw hex in app code |
| Auth | `MUSIC_OS_PASSWORD` + httpOnly cookie | WeekOS pattern; no OAuth |
| Data | Supabase Postgres + RLS | Writes via server actions / route handlers only |
| AI | Google Gemini (`gemini-2.5-flash` default) via Vercel AI SDK | `POST /api/coach` |
| Host | One Vercel project, root `apps/web` | Custom domain music.rajondey.com |

Env is validated in `apps/web/lib/env.ts`. Next and the env helper also read **repo-root** `.env` / `.env.local` (app-local files may be empty placeholders).

## Tree (as built)

```
Music.v2/
├── apps/web/
│   ├── app/
│   │   ├── (public)/          # /, /about, /blog, /tools, legal
│   │   ├── (private)/         # /studio, /songs, /skills, /report (+ redirects)
│   │   ├── login/             # password gate
│   │   ├── api/auth/login/
│   │   ├── api/coach/
│   │   ├── api/backup/        # cookie; JSON dump
│   │   ├── api/cron/backup/   # CRON_SECRET; monthly email
│   │   ├── sitemap.ts, robots.ts, llms.txt/, manifest.ts
│   │   └── layout.tsx         # fonts, theme, GTM, JSON-LD
│   ├── components/            # session, songs, skills, report, coach, public, nav, …
│   ├── lib/                   # server data + engines (chords, stand, backup, …)
│   └── middleware.ts
├── packages/
│   ├── tokens/                # CSS vars + Tailwind preset
│   ├── ui/                    # Button, Card, Brand, SectionLabel, …
│   ├── types/                 # shared unions + helpers
│   └── config/                # tsconfig / lint
├── supabase/migrations/ + seed.sql
├── context/                   # as-built brain
├── specs/
└── docs/                      # PROJECT_BRIEF, GUARDRAILS, GETTING_STARTED
```

## URL map

| URL | Who | What |
|---|---|---|
| `/` | Public | Home splash (hero video) |
| `/about` | Public | About + kit (`#kit`) |
| `/blog`, `/blog/[slug]` | Public | Posts |
| `/tools`, `/tools/[slug]` | Public | Utility catalogue; unknown slug 404s |
| `/privacy-policy`, `/terms-of-use`, `/cookies-policy` | Public | Legal |
| `/login` | Public | Password gate |
| `/studio` | Private | Daily hub: riyaz, session Stand, coach |
| `/studio/session/[id]` | Private | Edit a logged session |
| `/songs`, `/songs/[id]` | Private | Song Room |
| `/skills`, `/skills/[id]` | Private | Skills Lab (+ vocal profile) |
| `/report` | Private | Monthly report + notebook copy |
| `/vocal` | Private | Redirect → `/skills?tab=vocal#voice` |
| `/releases` | Private page | Redirect → `/songs` (not in middleware matcher) |
| `/journey` | Private page | Redirect → `/report` (not in middleware matcher) |
| `POST /api/coach` | Private | Streaming coach |
| `GET /api/backup` | Private | JSON dump |
| `GET /api/cron/backup` | Cron | Same dump by email |
| `POST /api/auth/login` | Public | Sets cookie |

Private layout: desktop **side-rail**, mobile **top bar + bottom tabs**. Nav items: Studio, Songs, Skills, Report (`components/nav/navItems.tsx`). Content `max-w-6xl`. Private pages send `robots: noindex`.

## Auth

Cookie name: `music_os_auth`. Value: SHA-256 hex of `{password}:music-os-unlock` (Node `crypto` in Node; Web Crypto in Edge middleware). HttpOnly, `Secure` in production, `SameSite=lax`, path `/`, max-age 1 year.

`middleware.ts` matcher: `/studio`, `/songs`, `/skills`, `/vocal`, `/report`, `/api/coach`, `/api/backup`. Missing password → `/login?error=config`. Bad/missing cookie → `/login?next=…`.

Cron is **secret-gated**, not cookie-gated. Login API is public.

## Storage

- **Postgres:** all Music OS rows (see `data-model.md`)
- **Repo / public folder:** brand PNGs, hero video, blog MD, chords-db consumed in `lib/chords.ts`
- **Not in DB:** public marketing copy constants (`lib/public-site-legacy.ts`)

## Notebook backup (Phase 10)

`lib/backup.ts` builds `{ version: 1, app: "music-os", exported_at, tables }`. Download from Report (`KeepACopy`) or monthly email (Resend). No in-app restore — hand the JSON to an agent. Do not overwrite live DB from an old file without a reviewed step. Public `/` never reads the dump.

## Deploy

One Vercel project, directory `apps/web`. Public and private ship together. Middleware + RLS are the boundary.

## Sync model

Public pages do **not** currently pull `songs.is_shared` as a live “current song / latest share” feed. Phase 4 (toggle Shared → public home) is still future. Public identity is mostly static + blog + tools.

## Invariants

1. One app, one deploy. No second frontend.
2. Middleware on every private route and private API listed above.
3. Public routes never query or render session / reflection / coach rows.
4. Service role + `GOOGLE_GENERATIVE_AI_API_KEY` + `MUSIC_OS_PASSWORD` + `CRON_SECRET` stay server-side.
5. Tokens from `packages/tokens` only.
6. Session log fans out once (`sessions` + `session_songs` / `session_skills`); other screens read derived views.
