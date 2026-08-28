# AI workflow

Build incrementally against a **spec** (or an explicit current step in `progress.md`). `context/` is the as-built system. `specs/` is the unit being built. Do not infer product behavior from scratch.

## Read order

1. `AGENTS.md` — which files this job needs
2. Feature gate if the work is new scope (`docs/GUARDRAILS.md`)
3. `context/progress.md`
4. The spec for this unit
5. Only the context files that spec lists

## Scoping

- One feature unit at a time
- Small, verifiable increments
- Do not mix unrelated boundaries in one step (e.g. public tools UI + private session schema)

Split the step if it cannot be verified end to end quickly, or if behavior is not in the spec / context.

## Missing requirements

- Do not invent product behavior
- Ambiguous → resolve in the relevant context file (or spec) before implementing
- Missing → add an open question to `progress.md` and ask Rajon

## Protected unless Rajon explicitly asks

- `.env` / secrets
- Applied Supabase migrations (add a new migration; do not rewrite history)
- Token source of truth in `packages/tokens` (no one-off hex in app code)
- `_references/` prototypes (copy ideas into the app; do not treat HTML as the product)
- `context/history/` (read-only archaeology)

## After a unit

1. It works end to end within the spec
2. No architecture invariant was violated
3. `context/progress.md` reflects the work
4. `pnpm lint` and `pnpm typecheck` pass
5. If UI shipped: Hallmark audit + design-review when the step calls for it
6. If architecture / data / UI language changed: update the matching `context/` file
