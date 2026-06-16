# Music Project — Source of Truth

> Read this fully before writing a single line of code. This is the canonical brief
> for both the private dashboard (Music OS) and the public site (music.rajondey.com).

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
4. **Warm, not clinical.** Warm dark aesthetic (deep amber/gold), not cold productivity blue.
5. **Practice makes perfect is wrong** — only intentional, thoughtful practice makes progress.

## One app, two surfaces (one codebase, one deploy)

| | Public home | Music OS (private admin) |
|---|---|---|
| Routes | `/` | `/studio`, `/journey`, `/releases` |
| App | `apps/web` — route group `(public)` | same app — route group `(private)` |
| Purpose | Public music home | Creative journal + AI coach |
| Auth | None | Password gate at `/login` + middleware (WeekOS pattern) |
| Domain | music.rajondey.com | same domain, protected paths |

One Next.js app, one Vercel deploy. Shared tokens/UI/types in `packages/`. See `ARCHITECTURE.md`.
Public ↔ private sync is same-server queries — no cross-app API.

---

## Music OS (private dashboard) — feature spec

Three tabs. Mobile-first (Rajon logs from his phone after morning practice).

### Tab 1 — STUDIO (home / default)
Today's session. Two blocks + the always-visible coach.

**Before practice — Intention block**
- "What song are you working on today?" (dropdown of current songs + "freestyle")
- "What's your one focus for this session?" (short free text)
- "How are you feeling about it?" (nervous / neutral / excited — just logging, no judgment)
- CTA: **Start Session** (logs timestamp)

**After practice — Reflection block**
- "What did you actually work on?" (free text)
- "What's one thing that felt better today?" (free text)
- "Did anything feel stuck?" (optional free text)
- "Rate the session quality" — 1–5, **quality not time**, labeled:
  unfocused / okay / solid / good flow / in the zone
- CTA: **Log Session**

**AI Coach chat**
- Below the session blocks, always visible, inviting (not buried).
- Pre-seeded with context (recent session, current songs, last weekly reflection, date).
- Natural trigger phrases: "music check", "help me plan this week", "I sound bad", etc.
- History persists per session in Supabase. Responses **stream**.

### Tab 2 — JOURNEY (weekly reflection) — qualitative, never quantitative
- **This week's focus** (set once/week): focus song-or-skill + "what do you want to feel by end of week?"
- **Weekly reflection**: what felt hard / what felt good / **one tiny win (required)** / would you do anything differently (optional)
- **Session log for the week**: plain list — date, song, quality rating, one-line reflection. No graphs, no trend lines.
- **Monthly view toggle**: past weeks as collapsible cards (week label, focus song, one win, overall feel).

### Tab 3 — RELEASES (song tracker)
Each song card: name + artist, current stage, comfort level
(Not comfortable / Getting there / Comfortable / Ready to record), notes,
last worked on (auto from sessions), optional target (no deadline pressure).

**Stages (states, not deadlines):**
1. 🌱 Discovering — listening, getting familiar
2. 🎸 Learning — actively practicing chords/melody
3. 💪 Comfortable — can play through with few stops
4. 🎙️ Recorded — rough take exists (even just for self)
5. ✨ Shared — posted anywhere (unlisted counts)

**Add Song:** name, artist, why this song (optional), starting stage, notes.

**Pre-loaded song:** "Knockin' on Heaven's Door" — Bob Dylan.

---

## Public site (music.rajondey.com) — spec

One page, dead simple. No blog, no newsletter.

**/ (Home)**
- Hero: name, tagline "Feel the Sound", 2–3 line bio (learner, engineer, music for joy)
- Current song I'm learning (manual now; synced from Music OS later)
- Links to SoundCloud + YouTube
- Latest release / most recent share (manual or synced)

Design: same warm dark aesthetic as Music OS (shared tokens). Minimal. Mobile-first.

---

## Critical reminders for whoever builds this

1. **Do not build a habit tracker.** No streaks, completion rings, or scores.
2. **The coach is central** — the chat should feel inviting, not buried.
3. **Every label and microcopy is warm and human.** "What shifted today?" not "Session notes".
4. **Mobile first.**
5. **Build Phase 1 completely before touching Phase 2 or 3.** See `ROADMAP.md`.
6. **Supabase RLS on from the start**, even though it's single-user.
7. **Password gate is the only auth** — no sign-up, email, or OAuth.
8. **Coach responses stream** (Vercel AI SDK or native ReadableStream).
