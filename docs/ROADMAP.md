# Roadmap

Build strictly in order. **Finish each phase before the next.**

## Phase 0 — Shell & ship (structure visible, deploy live)

0. **Page shells** — real section layout on `/`, `/studio`, `/journey`, `/releases` (empty states, warm copy; forms disabled until wired).
1. **GitHub** — initial commit, push to remote.
2. **Vercel** — one project, root `apps/web`, `MUSIC_OS_PASSWORD` set; preview URL loads.

**Out of scope for Phase 0:** CRUD, coach streaming, session logging, public data from DB.

## Phase 1 — Music OS core (private routes — deep dives)
0. **Design prep:** install [Hallmark](https://www.usehallmark.com/) (`npx skills add nutlope/hallmark`);
   confirm typography + Studio layout per `docs/DESIGN_SYSTEM.md` (journal, not WeekOS metrics).
1. Monorepo scaffold: Turborepo + pnpm, **`apps/web`** (single app), `packages/{tokens,ui,types,config}`,
   Supabase (tables + RLS + seed), `/login` password gate + **middleware** (httpOnly cookie, WeekOS pattern).
2. **`/studio`** — Intention block + Reflection block + session log → Supabase.
3. **`/releases`** — song CRUD + stages + comfort levels.
4. **AI Coach** — `/api/coach` (middleware-protected, streaming) + chat UI in Studio.
5. **`/journey`** — weekly focus + weekly reflection + this-week session list.

## Phase 2 — Polish
6. Monthly view (collapsible week cards) in Journey.
7. Live coach context injection (recent session + songs + last reflection).
8. Mobile responsiveness pass.

## Phase 3 — Public home (same app, new route group)
9. **`(public)/page.tsx`** at `/` — Hallmark **build** for macrostructure; no gradient hero, no fake stats.
10. Wire current song + latest share from Supabase (`is_shared` later).
11. Hallmark **audit** + design-review — public and private feel cohesive, warm editorial.

## Phase 4 — Connect (future)
12. Toggle a song to `Shared` in Releases → auto-surfaces on public home.
13. Optional: lightweight “publish” action instead of full auto-sync.

## Definition of done (every phase)
- Mobile-first, warm, no habit-tracker patterns.
- Middleware protects all private routes; no private data on `/`.
- `pnpm lint` + `pnpm typecheck` clean.
- RLS intact; secrets server-side only.
