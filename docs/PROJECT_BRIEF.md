# Music Project — Source of Truth

> Philosophy only. As-built surfaces, data, and IA live in `context/`. Work units live in `specs/`. Navigator: `AGENTS.md`.

## Who this is for

Rajon Dey — software engineer, daily guitar + vocal practitioner. He is building music
as a joyful, long-term **identity** — not income, not fame.

He values:
- Low-friction, decision-free systems
- Intentional progress over productivity theater
- Warmth over clinical dashboards
- Creativity over routine tracking

**His biggest barrier is confidence, not skill.** Every tool here must never make him feel
behind, scored, or judged.

## The non-negotiable philosophy

1. **Intentional practice > just showing up.** Never ask "did you practice?" Ask
   "what did you work on and what shifted?"
2. **Music ≠ routine work.** No streaks. No scores. No "Day 47 🔥". This is creativity and passion.
3. **Courage-first.** The system lowers the bar, never raises it. Celebrate showing up, not output.
4. **Warm, not clinical.** Warm amber/gold, not cold productivity blue. Light and dark themes both exist.
5. **Practice makes perfect is wrong** — only intentional, thoughtful practice makes progress.

## One app, two surfaces (one codebase, one deploy)

| | Public | Music OS (private) |
|---|---|---|
| Routes | `/`, `/about`, `/blog`, `/tools`, legal | `/studio`, `/songs`, `/skills`, `/report` |
| App | `apps/web` — `(public)` | same app — `(private)` |
| Purpose | Music home + utilities | Creative journal + AI coach |
| Auth | None | Password gate at `/login` + middleware |
| Domain | music.rajondey.com | same domain, protected paths |

One Next.js app, one Vercel deploy. Layout: `context/architecture.md`.

## Critical reminders

1. **Do not build a habit tracker.** No streaks, completion rings, or scores.
2. **The coach is central** — inviting, not buried.
3. **Microcopy is warm.** "What shifted today?" not "Session notes".
4. **Mobile first.**
5. **Supabase RLS from day one**, even though it is single-user.
6. **Password gate is the only auth** — no sign-up, email, or OAuth.
7. **Coach responses stream.**
8. New capability → feature gate (`docs/GUARDRAILS.md`) → spec → then code.

As-built Music OS: `context/domains/music-os.md`. Public site: `context/domains/public-site.md`.
