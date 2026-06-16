# Guardrails — apply before and during the build

These protect Music OS from becoming WeekOS-with-a-guitar: scored, pressured, or bloated.
Set up **before Phase 1**. Most are encoded in `.cursor/rules/` and enforced by the agent.

---

## 1. Feature gate (your example — highest priority)

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

**Rule:** `.cursor/rules/10-architecture-and-stack.mdc` + `docs/ROADMAP.md`

- Build Phase 1 → 2 → 3 → 4 in order. No public home before private core works.
- No scaffolding, installs, or "while we're here" work outside the current phase step.
- Green-light phrase: you say which phase/step to start (e.g. *"start Phase 1, step 1"*).

---

## 3. Product principles (confidence-first)

**Rule:** `.cursor/rules/00-product-principles.mdc`

Permanent veto on: streaks, scores, quotas (`X/wk`), completion rings, trend charts on practice,
leaderboards, "you missed a day", reward tiers, numeric confidence ratings.

**Litmus test:** Does this add pressure or reduce courage? Pressure → cut it.

---

## 4. WeekOS boundary

Music OS is **not** Weekly OS. If an idea is really about career, finance, gym, YouTube pipeline,
or life execution → it belongs in [Weekly OS](https://weekly-os-khaki.vercel.app/), not here.

Music OS = songs, practice intention/reflection, journey journal, coach, optional public share.

---

## 5. Design gate (no AI slop, no WeekOS chrome)

**Skills:** Hallmark (installed) + gstack `design-review`

- Hallmark **audit** after each major screen before marking a step done.
- WeekOS-style metric UI is banned even if it "looks professional."
- Tokens from `packages/tokens` only — no one-off hex in components.

---

## 6. Security & data gate

**Rule:** `.cursor/rules/50-data-and-security.mdc`

- RLS on every Supabase table from migration 1.
- `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `MUSIC_OS_PASSWORD` — server only.
- Public `/` never reads or renders private session/reflection rows.
- Middleware on all `(private)` routes and `/api/coach` before any private UI ships.

---

## 7. Scope documentation gate

If a feature **passes** the gate and you approve it:

1. Add a one-line note to `docs/ROADMAP.md` (which phase) or a short entry in `docs/DECISIONS.md`.
2. Update `docs/PROJECT_BRIEF.md` only if it changes core product behavior.

No "drive-by" features with no paper trail.

---

## 8. Technical hygiene (when code exists)

Plan to add in Phase 1 scaffold — not before, but don't skip:

| Practice | Why |
|---|---|
| `pnpm lint` + `pnpm typecheck` in CI or pre-commit | Catch breaks early |
| Env validation (e.g. zod on boot) | Fail fast on missing Supabase/Anthropic keys |
| Supabase migrations only (no manual dashboard edits) | Reproducible schema + RLS |
| Shared types in `packages/types` | One source for SongStage, Session, etc. |
| Server actions / route handlers for all writes | Keeps RLS + auth boundary clean |

---

## 9. Installed agent skills

| Skill | Install | When to use |
|---|---|---|
| **hallmark** | ✅ installed | Build/audit/redesign UI; anti-slop |
| **supabase-postgres-best-practices** | ✅ installed | Migrations, RLS, indexes, query patterns |

**Recommended later (install when relevant, not now):**

| Skill | Command | When |
|---|---|---|
| Next.js App Router patterns | `npx skills add wshobson/agents@nextjs-app-router-patterns` | Phase 1 scaffold |
| Supabase (general) | `npx skills add supabase/agent-skills@supabase` | If auth/RLS gets tricky |

**Already on your machine (gstack — use proactively):**

- `design-review` / `design-consultation` — warm-dark compliance vs WeekOS patterns
- `gstack-investigate` — root-cause debugging only after Phase 1 exists
- `gstack-ship` — when ready to PR/deploy (later)

Browse more: [skills.sh](https://skills.sh/)

---

## 10. Your workflow as product owner

1. **Idea** → say *"feature gate: [idea]"* → answer the questions → approve or drop.
2. **Build** → *"start Phase X, step Y"* only.
3. **UI done** → ask for *"hallmark audit on [screen]"*.
4. **Scope creep mid-session** → agent should re-run gate automatically; you can say *"stop, run guardrail"*.

---

## Quick reference: feature gate questions

1. Is this in the current ROADMAP phase (or should we add a future phase entry)?
2. Does it add **pressure/judgment** or reduce **courage**?
3. Is it a **habit-tracker / WeekOS metric** pattern (scores, quotas, charts)?
4. Does it belong in **WeekOS** instead of Music OS?
5. Could it **leak private practice data** to public `/`?
6. Is there a **simpler version** that serves the same emotional goal?
7. Did **Rajon explicitly approve** scope expansion?

**Any fail → STOP. Discuss. Then decide.**
