# Roadmap history

**This is a completed-phase checklist, not current IA.** Where we are now: `context/progress.md`.
Early phases still name Journey / Releases — those routes redirect. As-built: `context/domains/music-os.md`.

Build was strictly in order. **Finish each phase before the next.** (Historical rule.)

## Phase 0 — Shell & ship (structure visible, deploy live)

0. **Page shells** — real section layout on `/`, `/studio`, `/journey`, `/releases` (empty states, warm copy; forms disabled until wired).
1. **GitHub** — initial commit, push to remote.
2. **Vercel** — one project, root `apps/web`, `MUSIC_OS_PASSWORD` set; preview URL loads.

**Out of scope for Phase 0:** CRUD, coach streaming, session logging, public data from DB.

## Phase 1 — Music OS core (private routes — deep dives)
0. **Design prep:** install [Hallmark](https://www.usehallmark.com/) (`npx skills add nutlope/hallmark`);
   confirm typography + Studio layout per `context/ui-context.md` (journal, not WeekOS metrics).
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
Reference: `context/domains/legacy-public.md` (SEO, favicon, social, llms.txt from WordPress site).

9. **`(public)/page.tsx`** at `/` — Hallmark **build** for macrostructure; no gradient hero, no fake stats.
10. Wire current song + latest share from Supabase (`is_shared` later).
11. Hallmark **audit** + design-review — public and private feel cohesive, warm editorial.

## Phase 4 — Connect (future)
12. Toggle a song to `Shared` in Releases → auto-surfaces on public home.
13. Optional: lightweight “publish” action instead of full auto-sync.

## Phase 5 — Music OS Depth (v2)
Approved 2026-06-18 (see `context/decisions.md`). Replaces the 3-tab private OS with a connected
five-screen practice system. Full spec: `context/history/music-os-v2-plan.md`. Metric/chart guardrails
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

Approved 2026-06-18 (see `context/decisions.md`). Builds on Phase 5 without changing the
session fan-out contract. Manual-first for Bangla/Hindi; APIs stay enrichment.

22. ✅ **6A Trust & CRUD** — song delete, resource edit, part presets, add-song confirm.
23. ✅ **6B Schema** — `songs.lyrics_text`, `is_pinned`, `capo` (additive migration).
24. ✅ **6C Morning Studio** — continue card, pinned songs, inline cheat sheet, reflection hint.
25. ✅ **6D Real AI Coach** — `/api/coach` streaming + context from sessions/songs/reflection.
26. ✅ **6E Song Room depth** — paste lyrics, search UX, chord variants, capo in header.
27. ✅ **6F Secondary polish** — recent skills strip, vocal→session link, auto radar snapshot, calendar session notes.
28. 🔶 **6G Tools + closeout** — ✅ metronome, ✅ scale reference; Hallmark audit _(optional pass)_.

## Phase 7 — Execution mode (Session Stand)

Approved 2026-06-23 (see `context/decisions.md`). Shifts Studio from journal-first to
execution-first: one anchor per session, fullscreen Stand while practicing, reflection only
after "End session." Songs and skills are parallel anchors, not a hierarchy.

29. ✅ **7A Schema** — `sessions.anchor_type`, `anchor_skill_id`, `song_focus`; types + backfill.
30. ✅ **7B Stand loaders** — `lib/stand.ts`; song/skill/vocal/freestyle payloads.
31. ✅ **7C Stand UI** — read-only Stand components (parts, lyrics, chords, warm-ups).
32. ✅ **7D Anchor picker** — replace intention form; Continue card one-tap start.
33. ✅ **7E Phase machine** — stand → end → reflect; hide nav chrome via fullscreen overlay.
34. ✅ **7F Reflection simplify** — auto-tags from anchor; collapse skill browser.
35. ✅ **7G Polish** — edit-session shows anchor; regression pass.
36. ✅ **7H Skill resources** — `skill_resources` + `skill_states.practice_note`; `/skills/[id]`
    notebook; Stand shows note + top 3 links; search filter; anchor picker catalogue;
    visible resource remove; 5-link soft cap.

## Phase 8 — Vocal Skills Lab

Approved 2026-07-09 (see `context/decisions.md`). Extends the skills spine with a vocal
catalogue without touching guitar Skills Lab behaviour.

37. ✅ **8A Schema** — `skills.domain`; unique `(domain, category, name)`; vocal radar axes on
    `skills` / `skill_snapshots.domain`.
38. ✅ **8B Seed** — 83 vocal skills (12 categories); warm-up ritual stays on `/vocal` only.
39. ✅ **8C–8D Skills Lab** — Guitar | Vocal tabs; vocal radar deferred (placeholder card).
40. ✅ **8E Stand** — Vocal anchor + optional `anchor_skill_id`; warm-ups always + skill note/links.
41. ✅ **8F Fan-out** — Reflection tags guitar + vocal skills; cross-links `/vocal` ↔ Skills Lab.

## Phase 9 — Two rhythms (Riyaz + Session)

Approved 2026-07-09 (see `context/decisions.md`). Matches daily morning riyaz vs 4–5×/week full
sessions. No habit-tracker patterns; riyaz excluded from calendar.

42. ✅ **9A Schema** — `sessions.practice_kind`, `sessions.riyaz_feel`; types in `packages/types`.
43. ✅ **9B Lib** — `session-utils.ts`; `lastRiyaz` in studio data; report split queries.
44. ✅ **9C Actions** — `startRiyaz`, `logRiyaz`; full sessions set `practice_kind = 'session'`.
45. ✅ **9D Riyaz end** — `RiyazEndSheet` (Done + optional chip); `SessionFlow` branch.
46. ✅ **9E Studio** — `RiyazEntry` (vocal/guitar/same-as-yesterday) above full session block.
47. ✅ **9F Report** — sessions vs riyaz counts; calendar = sessions only.
48. ✅ **9G Vocal demotion** — nav 4 tabs; voice profile on Skills (Vocal); `/vocal` redirects.
49. ✅ **9H Cleanup** — `/releases` → `/songs`; `/journey` → `/report`.
50. ✅ **9I Docs** — ROADMAP, DECISIONS, DATA_MODEL.

## Phase 10 — Durability (off-site notebook copy)

Approved 2026-08-11 (see `context/decisions.md`). Complements Supabase; does not replace it.
No restore UI, no backup-health scores, no new nav tab.

51. **Notebook copy** — versioned JSON dump of all user tables; anytime download from
    Report (`GET /api/backup`, cookie); monthly email on the 1st (`GET /api/cron/backup`,
    `CRON_SECRET` + Resend). Recover later by handing the file to an agent.

## Phase 11 — Drift (listening pockets)

Approved 2026-08-11 (see `context/decisions.md`). Pre-notebook lists on `/songs`.
Not a second song tracker. No prescribed categories. No new nav tab.

52. ✅ **Named pockets** — `drift_lists` + `drift_items` (RLS); seed **Noticed**; shelf on
    `/songs` (title or URL); promote → existing Song Room; let go. Backup includes both tables.
53. ✅ **Shared categories + IA** — `songs.category_id`; `/songs` tabs (**Songs List** /
    **Songs Notebook** only). Categories live inside as a dropdown + headings. Seed
    Noticed / Classic covers / Hangouts / Rabindra & Nazrul (deletable). No category tabs.

## Phase 12 — Public tools shelf

Approved 2026-08-29 (see `context/decisions.md` and `specs/archive/12.54-tools-catalogue.md`).
Public catalogue of musician utilities. Gear stays on `/about#kit`. No Music OS
data, no skill-improvement framing, no icon-tile grid.

54. ✅ **Catalogue shell** — registry, `/tools` index (empty setlist), `/tools/[slug]`
    frame + not-found; sitemap + `llms.txt` read the registry.
55. ✅ **Chords** — public `/tools/chords`; type + letter/spelling/quality navigator;
    standard-tuning diagrams; name locked (not Voicings). See `specs/archive/12.55-chords.md`.

## Definition of done (every phase)
- Mobile-first, warm, no habit-tracker patterns.
- Middleware protects all private routes; no private data on `/`.
- `pnpm lint` + `pnpm typecheck` clean.
- RLS intact; secrets server-side only.
