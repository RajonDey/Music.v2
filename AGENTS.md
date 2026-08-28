# Agent navigator

This file is the map, not the product. Read it to find the **smallest set of files** for the current job. Do not load every doc.

`.cursor/rules/` still apply automatically (philosophy + feature gate). They are vetoes.

---

## How to start every task

1. **Always** — `docs/GUARDRAILS.md` (and the always-on Cursor rules). New capability → feature gate **before** code.
2. **Then** — `context/progress.md` (where we are).
3. **Then** — the spec for this job (`specs/`, including `specs/archive/` for shipped units).
4. **Then** — only the context files listed below. Do not invent behavior missing from those files.

If there is no spec and the work is new scope: **stop**, run the feature gate, write a spec, wait for Rajon to approve.

---

## Folder roles

| Folder | Job |
|---|---|
| `docs/` | Core memory: philosophy, gates, how to run locally |
| `context/` | Living as-built picture of the whole project |
| `context/history/` | Old plans — do not implement from these |
| `specs/` | Work units (current + `archive/`) |
| `_references/` | Research, PDFs, HTML prototypes — never product truth |
| `.cursor/rules/` | Always-on vetoes |
| `.agents/skills/` | Hallmark, Supabase Postgres |

---

## Open this, not everything

| If you are… | Open |
|---|---|
| Lost / first message in a thread | `context/project-overview.md` |
| Changing stack, folders, auth, deploy | `context/architecture.md` |
| Tables, RLS, backups | `context/data-model.md` |
| Conventions, file ownership | `context/code-standards.md` |
| UI, copy, tokens, layout | `context/ui-context.md` |
| How to take a unit of work | `context/ai-workflow.md` |
| Where we are / what’s next | `context/progress.md` |
| Past phase checklist | `context/roadmap-history.md` |
| Why a past call was made | `context/decisions.md` |
| Private practice surfaces | `context/domains/music-os.md` |
| Public home / about / blog / SEO | `context/domains/public-site.md` |
| WordPress identity / old SEO dump | `context/domains/legacy-public.md` |
| Coach | `context/domains/coach.md` |
| `/tools` | `context/domains/tools.md` |
| Implementing a numbered unit | `specs/{phase}.{step}-{slug}.md` or `specs/archive/` |
| Running the app locally | `docs/GETTING_STARTED.md` |
| New product idea | STOP → `docs/GUARDRAILS.md` |
| Philosophy / who this is for | `docs/PROJECT_BRIEF.md` |

---

## Non-negotiables (do not re-derive)

- Not a habit tracker. No streaks, scores, quotas, completion rings, “you missed a day.”
- Courage-first. Pressure → cut it, unless Rajon overrides in writing.
- Public `/` never renders session logs, reflections, or coach chat.
- Secrets and Supabase writes stay server-side. RLS from day one.
- Tokens from `packages/tokens` only. WeekOS is an **auth** pattern, not a UI/metrics pattern.
- Build against a spec (or the current progress step). Do not combine unrelated units.

---

## Skills

| Skill | Use when |
|---|---|
| **hallmark** (`.agents/skills/hallmark`) | Build / audit / redesign UI |
| **supabase-postgres-best-practices** | Migrations, RLS, indexes, query patterns |
| gstack `design-review` | Warm-dark + anti-WeekOS-metric check |
| gstack `design-consultation` | Typography / layout direction |
| gstack `gstack-investigate` | Debugging after code exists |
| gstack `gstack-ship` | PR / deploy when asked |

Install more only when Rajon asks: `npx skills add <owner/repo@skill>` · [skills.sh](https://skills.sh/)

---

## After a unit ships

1. The spec’s “done when” checks pass (`pnpm lint` + `pnpm typecheck` at minimum).
2. Move the spec to `specs/archive/`.
3. Update `context/progress.md`.
4. If architecture, data, or UI language changed, update the matching `context/` file.
5. If Rajon approved new scope, append `context/decisions.md`.
