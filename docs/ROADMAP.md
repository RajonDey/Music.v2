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
Reference: `docs/LEGACY_PUBLIC_SITE.md` (SEO, favicon, social, llms.txt from WordPress site).

9. **`(public)/page.tsx`** at `/` — Hallmark **build** for macrostructure; no gradient hero, no fake stats.
10. Wire current song + latest share from Supabase (`is_shared` later).
11. Hallmark **audit** + design-review — public and private feel cohesive, warm editorial.

## Phase 4 — Connect (future)
12. Toggle a song to `Shared` in Releases → auto-surfaces on public home.
13. Optional: lightweight “publish” action instead of full auto-sync.

## Phase 5 — Music OS Depth (v2)
Approved 2026-06-18 (see `docs/DECISIONS.md`). Replaces the 3-tab private OS with a connected
five-screen practice system. Full spec: `docs/MUSIC_OS_V2.md`. Metric/chart guardrails
explicitly overridden for this phase. Build strictly in order, manual-entry first.

14. ✅ **Schema + data-flow engine** — extend `songs`; add `song_parts`, `song_resources`,
    `song_stage_log`, `session_songs`, `session_skills`; migrations + RLS + seed.
    _(Migration + seed applied to remote 2026-06-18; seed loaded via service-role API.)_
15. ✅ **Song Room** — per-song notebook: header, parts map, chords, resources, learning-stage
    pipeline, auto practice log, completed shelf. (manual entry; no external API yet)
16. ✅ **Practice Room** — evolve Studio into the daily hub; multi-song/skill tagging that fans
    out to Song Room + Skills Lab; deep-links into Song Room and Skills Lab.
17. ✅ **Skills Lab** — seed 110 skills (11 categories); milestone/progress/evergreen tiers;
    radar chart (six axes) + moments/evidence log + ear-training auto-capture.
18. ✅ **Vocal Studio** — range tracker, warm-up routine, exercises dock, confidence log + trend,
    voice-day tags. _(Web Audio pitch visualiser deferred — optional final sub-step.)_
19. ✅ **Monthly Report** — hero counts, practice calendar, skills radar overlay (month vs month),
    stage-move wins, confidence trend, year view, monthly reflection. _(Nav now shows Report
    instead of weekly Journey; `/journey` route still reachable, unlinked, retired in step 21.
    Monthly radar snapshot is captured via a manual button — automate later if wanted.)_
20. ✅ **API enrichment** — ✅ chords-db chord diagrams (offline, server-rendered into the Parts
    map); ✅ MusicBrainz "find a song" lookup → prefilled add; ✅ lyrics.ovh reference (lazy, via
    `?lyrics=1`). _VexFlow notation skipped: the model stores chord-name text + notes, no melodic/
    note data, so standard notation would render empty staves — revisit if a manual notation
    input is ever added. Chord JSON stays server-only (verified: `/songs/[id]` ~1.5 kB client JS)._
21. 🔶 **Navigation/IA redesign** — ✅ desktop side-rail + mobile bottom-bar shell; ✅ wider
    content (max-w-6xl) with per-screen responsive multi-column grids; ✅ weekly Journey retired
    from nav. _Remaining: optional formal Hallmark 58-gate audit pass._

## Phase 6 — Daily UX & trust (post-v2 polish)

Approved 2026-06-18 (see `docs/DECISIONS.md`). Builds on Phase 5 without changing the
session fan-out contract. Manual-first for Bangla/Hindi; APIs stay enrichment.

22. ✅ **6A Trust & CRUD** — song delete, resource edit, part presets, add-song confirm.
23. ✅ **6B Schema** — `songs.lyrics_text`, `is_pinned`, `capo` (additive migration).
24. ✅ **6C Morning Studio** — continue card, pinned songs, inline cheat sheet, reflection hint.
25. ✅ **6D Real AI Coach** — `/api/coach` streaming + context from sessions/songs/reflection.
26. ✅ **6E Song Room depth** — paste lyrics, search UX, chord variants, capo in header.
27. ✅ **6F Secondary polish** — recent skills strip, vocal→session link, auto radar snapshot, calendar session notes.
28. 🔶 **6G Tools + closeout** — ✅ metronome, ✅ scale reference; Hallmark audit _(optional pass)_.

## Definition of done (every phase)
- Mobile-first, warm, no habit-tracker patterns.
- Middleware protects all private routes; no private data on `/`.
- `pnpm lint` + `pnpm typecheck` clean.
- RLS intact; secrets server-side only.
