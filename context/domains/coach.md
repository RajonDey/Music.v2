# AI coach (as built)

Central mentor on **Studio** (`CoachPanel`), not a buried settings widget. Warm, brief, never shame or score.

## Boundary

- `POST /api/coach` — middleware cookie required
- Persist to `coach_messages` (today’s thread loaded on Studio)
- Must not appear on public routes
- `GOOGLE_GENERATIVE_AI_API_KEY` server-only. Optional `GOOGLE_MODEL` (default `gemini-2.5-flash`)

## Technical

- Vercel AI SDK + `@ai-sdk/google`, streamed
- System prompt: `apps/web/lib/coach-prompt.ts`
- Context: `buildCoachContext()` in `lib/coach-context.ts` — latest logged session, up to 12 songs (stage / learning_stage / pinned), last monthly reflection or weekly tiny win, date
- Unconfigured key → 503 with a human message; rate-limit copy may suggest `gemini-2.0-flash-lite`

## Behavior

Trigger phrases (natural language, not slash commands):

| Phrase | Coach behavior |
|---|---|
| "music check" | Structured, gentle check-in using recent context |
| "help me plan this week" | A light 5-day intentional practice plan (small, specific, kind) |
| "I sound bad" / "I'm not improving" | Plateau normalization; reframe; one tiny next step |
| "what song should I learn" | 2–3 song suggestions tuned to current stage |
| "I want to record something" | Minimum-viable-recording guide (phone, one take, done) |

Keep the spirit: one tiny next step when discouraged; no streaks. The live system prompt is `coach-prompt.ts` — do not fork a second copy here.

## Entry points

- `app/api/coach/route.ts`
- `app/(private)/coach/actions.ts`
- `lib/coach.ts`, `coach-prompt.ts`, `coach-context.ts`
- `components/coach/CoachPanel.tsx`
