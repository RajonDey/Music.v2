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
