# Project overview

Rajon Dey’s music world: **one Next.js app** (`apps/web` → [music.rajondey.com](https://music.rajondey.com)) with a public home and a private Music OS. He builds music as a lifelong joy, not income or fame. **The barrier is confidence, not skill.** Nothing here may make him feel behind, scored, or judged.

## Goals

1. Lower the bar; celebrate showing up and intention over output
2. One place for daily practice (Studio) that fans out to songs, skills, and a monthly look-back
3. A public face that feels like the same person — editorial, warm — plus small musician utilities at `/tools`

## Core user flow (as built)

1. Unlock Music OS at `/login` (password cookie, ~1 year).
2. Morning: **riyaz** from Studio (vocal or guitar warm-up, light end chip). Sit-down: pick an **anchor** (song / guitar skill / vocal / freestyle) → fullscreen **Stand** → end → reflection.
3. Deeper work in **Song Room** (`/songs`) or **Skills Lab** (`/skills`). Coach stays on Studio.
4. Once in a while: **Report** (`/report`) — month look-back, not a scorecard. Optional notebook JSON copy from there.
5. Public visitors: `/` (Feel the Sound), `/about`, `/blog`, `/tools` — no practice diary.

## Features (as built)

### Public

- Home splash (`/`), About (incl. kit), Blog, Tools catalogue, legal pages
- SEO: sitemap, robots, `llms.txt`, JSON-LD, brand assets from the old WordPress site
- First live tool: **Chords** at `/tools/chords`

### Music OS (private)

- **Studio** — riyaz + full session Stand + coach + private metronome
- **Songs** — Drift lists + notebooks (parts, chords, lyrics, resources, learning-stage pipeline)
- **Skills** — guitar / vocal catalogues, radar, moments; vocal profile (range, warm-ups, confidence) lives here (`/vocal` redirects)
- **Report** — monthly retrospective, calendar (sessions only, not riyaz), backup download
- Redirects: `/releases` → `/songs`, `/journey` → `/report`

## Scope

### In scope

- Single-user password-gated journal + practice system
- Public site identity + utility shelf
- Off-site JSON notebook copy (download + monthly email)

### Out of scope

- Habit tracker / WeekOS metrics (streaks, scores, quotas, completion rings, “you missed a day”)
- Career / finance / gym / life execution (Weekly OS)
- Sign-up, OAuth, multi-user accounts
- In-app backup restore UI
- Public skill-improvement gamification, ads, freemium (deferred)
- Web Audio pitch visualiser (deferred)
- VexFlow notation (no melodic note data in the model)

## Success criteria

1. Rajon can log riyaz or a session from a phone without feeling scored
2. Public `/` never shows sessions, reflections, or coach chat
3. A new public tool is one registry row + one body component, not a redesign
