# Decisions log

Short record of scope approved **through the feature gate** (see `docs/GUARDRAILS.md`).
Add a dated entry when Rajon explicitly approves something not in the original brief.

## Template

```
### YYYY-MM-DD — [Title]
- **Proposal:** …
- **Gate:** passed / override (reason)
- **Decision:** …
- **Roadmap:** Phase X step Y / deferred to Phase Z
```

---

## 2026-06-23 — Phase 7: Execution mode (Session Stand + anchors)

### 2026-06-23 — Session Stand and anchor-based practice flow
- **Proposal:** Redesign Studio around execution, not management. One **anchor** per session
  (song, guitar skill, vocal, or freestyle). Fullscreen **Stand** while practicing (chords,
  lyrics, warm-ups — read-only). Reflection only after "End session." Songs and skills stay
  parallel; optional `song_focus` (guitar / vocal / both) on song anchors. Continue card
  starts a session in one tap instead of linking to the song notebook.
- **Gate:** Explicitly approved by Rajon ("Proceed one by one") after architecture review.
  Finishes the stated product purpose (low-friction creative execution); no habit-tracker
  patterns. Nav demotion / Library hub deferred.
- **Decision:** Phase 7 in `docs/ROADMAP.md`. Build 7A→7G in order. Schema additive only;
  backward-compat via `anchor_type` backfill from `song_id`.
- **Roadmap:** Phase 7 steps 29–35.

---

## 2026-06-18 — Music OS Depth (v2): 5-screen system + metric override

### 2026-06-18 — Expand Music OS from 3 tabs to a 5-screen practice system
- **Proposal:** Replace the current Studio/Journey/Releases model with a connected
  five-screen system: **Practice Room** (daily hub) → **Song Room** (per-song notebook) →
  **Skills Lab** (80+ skills across 11 categories) → **Vocal Studio** → **Monthly Report**.
  Core principle: one daily log fans out into every other screen — no double entry.
  Full spec in `docs/MUSIC_OS_V2.md`.
- **Gate:** Explicitly approved by Rajon in conversation. Major scope expansion of the private OS.
- **Decision:** Build it as a new roadmap phase (Phase 5). Manual-entry first; free APIs
  (MusicBrainz, chords-db, lyrics.ovh, Web Audio pitch, VexFlow) layered last.
- **Roadmap:** New Phase 5 — Music OS Depth. Build order: Song Room → data-flow engine →
  Skills Lab → Vocal Studio → Monthly Report → API enrichment.

### 2026-06-18 — Metric/visualization guardrail override for Music OS v2
- **Proposal:** v2 includes surfaces that conflict with the standing product principles:
  Skills Lab **radar chart** (per-axis scores + month-vs-month overlay), **1–5 progress-skill
  ratings**, **1–5 vocal confidence slider + confidence trend line**, and a Monthly Report
  with **hero counts** (sessions/songs/recordings), **month calendar grid**, and
  **12-month session-count year view**. These hit the permanent vetoes in
  `00-product-principles.mdc` / `GUARDRAILS.md` (no scores, numeric confidence ratings,
  trend charts on practice data, day-count calendars).
- **Gate:** **Override** — Rajon's explicit written call. Reasoning: "Skip the guardrails here.
  We're building it now and want it perfect and better; if we need charts/graphs we take them.
  Guardrails are for future polish once it's fully built."
- **Decision:** Charts, radar, numeric ratings, and counts are **approved for v2**. The
  confidence-first guardrails remain the default for any *future* feature, but are explicitly
  lifted for the v2 surfaces listed above. Trade-off accepted: these surfaces can introduce
  comparison/pressure; revisit during a later polish pass if any feel discouraging in use.
- **Roadmap:** Applies to Phase 5 (Song Room excluded — it had no conflicts).

### 2026-06-18 — Retire the weekly Journey model
- **Proposal:** The existing `/journey` weekly-reflection design (weekly focus + tiny win +
  weekly session list) does not fit the v2 system, which has a daily layer (Practice Room) and
  a monthly layer (Monthly Report) but no weekly layer.
- **Decision:** Rethink/retire the weekly Journey tab and its UI. The monthly reflection moves
  to the Monthly Report. `weekly_reflections` table is deprecated for v2 (kept for back-compat
  until migration). New IA + UI/UX to be designed for the v2 navigation.
- **Roadmap:** Phase 5. Navigation redesign tracked in `docs/MUSIC_OS_V2.md`.

---

## 2026-06-18 — Phase 6: Daily UX & trust

### 2026-06-18 — Post-v2 UX polish (morning readiness, CRUD, real coach)
- **Proposal:** After Phase 5 v2 depth, improve daily use: Studio “continue” + cheat sheet,
  song delete/edit gaps, paste-your-own lyrics (Bangla/Hindi primary), MusicBrainz confirm step,
  real AI coach (Phase 1 step 4 never shipped), chord shape cycling, capo field.
- **Gate:** Explicitly approved by Rajon (“Proceed”) in conversation after UX review.
- **Decision:** New Phase 6 in `docs/ROADMAP.md`. Build 6A→6E in order; 6F/6G deferred.
  Practice tips that imply habit trackers (daily minimums, weekly check-offs) rejected.
  Metronome/session-shape copy approved as optional tools, not streaks.
- **Roadmap:** Phase 6 steps 22–28.

---

## 2026-06-17 decisions — Public face redesign

### 2026-06-17 — Public site scope expanded
- **Proposal:** Add Blog (MDX), About, and Tools pages to the public site. Add Beehive newsletter embed on home page.
- **Original brief:** "One page, dead simple. No blog, no newsletter." (PROJECT_BRIEF.md)
- **Gate:** Explicitly approved by Rajon in conversation. Public-facing scope change, no private data risk, no habit-tracker patterns introduced.
- **Decision:** Public site now has: `/` (home + newsletter), `/about`, `/blog` (MDX from `content/blog/`), `/blog/[slug]`, `/tools`, legal pages. Music OS link removed from public nav. "Currently learning" section removed from public home.
- **Roadmap:** Prioritizing public face before Music OS core (reversing Phase 1/3 order). Rajon's explicit call.

### 2026-06-17 — Brand identity
- **Proposal:** Drop "RD Beats" (wrong genre association — implies beat-making, not guitar/vocals) and "RD Music" (generic).
- **Decision:** Nav wordmark = **"Music"** (or **"RD Music"** as an acceptable handle). Site identity = **"Feel the Sound"** (tagline carries the brand). Personal name "Rajon Dey" anchors the hero. Page `<title>`: "Feel the Sound | Rajon Dey Music". "RD Music" acceptable as a social handle reference.
- **Roadmap:** Applies to Phase 3 public home and all public routes.

---

## Pre-build decisions (foundation)

### 2026-06-16 — Single app, route groups
- **Decision:** One Next.js app (`apps/web`) with `(public)` + `(private)` + middleware.
  Not two deployable apps. music.rajondey.com serves both surfaces.
- **Why:** Simple public page + private admin; easier sync; acceptable security with middleware.

### 2026-06-16 — Journal over metrics
- **Decision:** Music OS uses feeling/intention, not WeekOS-style scores and quotas.
- **Why:** Confidence is the barrier; habit-tracker UX would harm the product.

### 2026-06-16 — Hallmark + Supabase skills
- **Decision:** Install `nutlope/hallmark` and `supabase-postgres-best-practices` in `.agents/skills/`.
- **Why:** Design quality and RLS/migration discipline from day one.

### 2026-06-16 — Preserve legacy public site identity
- **Proposal:** Keep [RajonDey/Music](https://github.com/RajonDey/Music) as historical source; extract SEO, favicon, social links, and AI discoverability into Music.v2 before Phase 3 public rebuild.
- **Gate:** passed — migration prep on same domain; no new product behavior; protects existing Google presence.
- **Decision:** Document in `docs/LEGACY_PUBLIC_SITE.md`; constants in `apps/web/lib/public-site-legacy.ts`; brand PNGs in `apps/web/public/brand/`; `/robots.txt`, `/sitemap.xml`, `/llms.txt`, JSON-LD wired in Next.js. Local WP clone at `.legacy/Music` (gitignored).
- **Roadmap:** Phase 3 step 9 uses this reference for public home UI; GTM migration deferred until explicit approval.
