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
