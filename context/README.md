# Context — living project brain

This folder is the as-built picture of Music OS + the public site. A future agent should be able to recover **structure and core behavior** from here without reading the whole git history.

It is **not** the feature-gate philosophy (`docs/GUARDRAILS.md`) and **not** a work ticket (`specs/`).

## Files

| File | Answers |
|---|---|
| `project-overview.md` | What this app is, who it is for, in / out of scope |
| `architecture.md` | Stack, folders, routes, auth, deploy, invariants |
| `data-model.md` | Tables, RLS, backup, what public routes must never read |
| `code-standards.md` | TS, App Router, tokens, file ownership |
| `ui-context.md` | Theme, voice, layout patterns |
| `ai-workflow.md` | How to take work |
| `progress.md` | Current phase, next, session notes |
| `roadmap-history.md` | Completed phase checklist (not current IA) |
| `decisions.md` | Gate log (append-only) |
| `domains/` | Music OS, public site, coach, tools, WP legacy notes |
| `history/` | Original plans — do not implement from these |

Core memory (rarely changes): `docs/PROJECT_BRIEF.md`, `docs/GUARDRAILS.md`, `docs/GETTING_STARTED.md`.

## Keep in sync

Update the matching file here whenever implementation changes architecture, data, conventions, UI language, or domain behavior. Do not leave the truth only in chat.
