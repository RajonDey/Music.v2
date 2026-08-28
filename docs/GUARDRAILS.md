# Guardrails — apply before and during the build

These protect Music OS from becoming WeekOS-with-a-guitar: scored, pressured, or bloated.
Most are encoded in `.cursor/rules/` and enforced by the agent.

---

## 1. Feature gate (highest priority)

**Rule:** `.cursor/rules/05-feature-guardrails.mdc` (always on)

When you (or the agent) propose **anything new** — a feature, integration, chart, social login,
notification, gamification, new tab, API, etc. — the agent must **stop and run the gate** before
writing code. No exceptions for "small" or "quick" additions.

The gate is a short Q&A. If any answer is wrong, the agent presents a **STOP** summary and
waits for your explicit yes/no. It does not implement until you approve.

**You can trigger it yourself:** say *"feature gate"* or *"run the guardrail"* when you have a
random idea and want sanity-checking before anyone builds it.

---

## 2. Phase gate

**Rule:** `.cursor/rules/10-architecture-and-stack.mdc` + `context/progress.md`

- Implement only a green-lit spec (or an explicit current step in `context/progress.md`).
- No scaffolding, installs, or "while we're here" work outside that unit.
- Green-light phrase: you name the spec or say which step to start.

History of past phases: `context/roadmap-history.md`. Do not treat early Journey/Releases copy there as current IA.

---

## 3. Product principles (confidence-first)

**Rule:** `.cursor/rules/00-product-principles.mdc`

Permanent veto on: streaks, scores, quotas (`X/wk`), completion rings, trend charts on practice
as judgment, leaderboards, "you missed a day", reward tiers, numeric confidence ratings.

**Litmus test:** Does this add pressure or reduce courage? Pressure → cut it.

(Phase 5+ Report/Skills charts were an explicit override — see `context/decisions.md`. That does not reopen streaks or quotas.)

---

## 4. WeekOS boundary

Music OS is **not** Weekly OS. If an idea is really about career, finance, gym, YouTube pipeline,
or life execution → it belongs in [Weekly OS](https://weekly-os-khaki.vercel.app/), not here.

Music OS = songs, practice intention/reflection, skills, coach, optional public share, public utilities.

---

## 5. Design gate (no AI slop, no WeekOS chrome)

**Skills:** Hallmark (installed) + gstack `design-review`

- Hallmark **audit** after each major screen before marking a step done.
- WeekOS-style metric UI is banned even if it "looks professional."
- Tokens from `packages/tokens` only — no one-off hex in components.
- Spec: `context/ui-context.md`

---

## 6. Security & data gate

**Rule:** `.cursor/rules/50-data-and-security.mdc` · schema: `context/data-model.md`

- RLS on every Supabase table from migration 1.
- `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`, `MUSIC_OS_PASSWORD` — server only.
- Public `/` never reads or renders private session/reflection rows.
- Middleware on all `(private)` routes and `/api/coach`.

---

## 7. Scope documentation gate

If a feature **passes** the gate and you approve it:

1. Write a spec in `specs/` and a one-line note in `context/progress.md`.
2. Add a dated entry in `context/decisions.md`.
3. Update `docs/PROJECT_BRIEF.md` only if it changes core philosophy.

No "drive-by" features with no paper trail.

---

## 8. Technical hygiene

| Practice | Why |
|---|---|
| `pnpm lint` + `pnpm typecheck` | Catch breaks early |
| Env validation (`lib/env.ts`) | Fail fast on missing keys |
| Supabase migrations only (no manual dashboard edits) | Reproducible schema + RLS |
| Shared types in `packages/types` | One source for stages, sessions, etc. |
| Server actions / route handlers for all writes | Keeps RLS + auth boundary clean |

---

## 9. Installed agent skills

| Skill | Install | When to use |
|---|---|---|
| **hallmark** | ✅ installed | Build/audit/redesign UI; anti-slop |
| **supabase-postgres-best-practices** | ✅ installed | Migrations, RLS, indexes, query patterns |

gstack on the machine: `design-review`, `design-consultation`, `gstack-investigate`, `gstack-ship`.

Browse more: [skills.sh](https://skills.sh/)

---

## 10. Your workflow as product owner

1. **Idea** → say *"feature gate: [idea]"* → answer the questions → approve or drop.
2. **Build** → a spec in `specs/` (or *"start [named unit]"* only).
3. **UI done** → ask for *"hallmark audit on [screen]"*.
4. **Scope creep mid-session** → agent should re-run gate automatically; you can say *"stop, run guardrail"*.

---

## Quick reference: feature gate questions

1. Is this in the current progress/spec (or should we add a future entry)?
2. Does it add **pressure/judgment** or reduce **courage**?
3. Is it a **habit-tracker / WeekOS metric** pattern (scores, quotas, charts as judgment)?
4. Does it belong in **WeekOS** instead of Music OS?
5. Could it **leak private practice data** to public `/`?
6. Is there a **simpler version** that serves the same emotional goal?
7. Did **Rajon explicitly approve** scope expansion?

**Any fail → STOP. Discuss. Then decide.**
