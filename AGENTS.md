# Agent guide

Guidance for any AI agent working in this repo. `.cursor/rules/` apply automatically.

## Read first
1. `docs/PROJECT_BRIEF.md` — philosophy + features
2. `docs/GUARDRAILS.md` — **feature gate, phase gate, skills** (read before any new idea)
3. `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md`, `docs/DATA_MODEL.md`, `docs/ROADMAP.md`

## Non-negotiables
- Run **feature guardrail** (`.cursor/rules/05-feature-guardrails.mdc`) before any new scope.
- NOT a habit tracker. WeekOS does metrics; Music OS does feeling + intention.
- Build phases in order. Green-light required per step.
- Secrets server-side. RLS from day one.

## Installed skills (project: `.agents/skills/`)

| Skill | Use when |
|---|---|
| **hallmark** | Build/audit/redesign UI; `hallmark audit` before marking UI steps done |
| **supabase-postgres-best-practices** | Migrations, RLS policies, indexes, Postgres patterns |

Install more: `npx skills add <owner/repo@skill>` · browse [skills.sh](https://skills.sh/)

**Recommended at Phase 1 scaffold (not installed yet):**
- `wshobson/agents@nextjs-app-router-patterns` — App Router conventions

## gstack skills (already on machine — use proactively)
- `design-review` — warm-dark + anti-WeekOS-metric check
- `design-consultation` — typography/layout direction
- `gstack-investigate` — debugging after code exists
- `gstack-ship` — PR/deploy when ready

## Workflow
- New idea → feature gate → explicit approval → log in `docs/DECISIONS.md` if scope changed
- UI surface shipped → Hallmark audit + design-review
- Tokens from `packages/tokens` only
- WeekOS pattern for **auth only**, not UI/metrics
