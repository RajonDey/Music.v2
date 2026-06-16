# Design System

Warm, creative, slightly musical. **Journal + creative space**, not a productivity dashboard.
Deep warm dark + amber/gold. Never cold productivity blue or WeekOS-style scoring chrome.

Defined once in `packages/tokens`, consumed by `apps/web`.

---

## WeekOS vs Music OS — what to borrow, what to reject

Rajon already runs [Weekly OS](https://weekly-os-khaki.vercel.app/) for career, finance, body,
and life execution. Music OS lives in the **same family** (dark, private, password-gated) but
must **not** inherit its soul.

| WeekOS (reference) | Music OS (this product) |
|---|---|
| Scores (`50/100`), reward tiers, pillar strength charts | **No scores.** Ever. No tiers, no “best/weakest pillar.” |
| Weekly numeric targets (`10/wk`, `7/wk`, `0/520`) | **No quotas.** No “sessions per week” counters. |
| Checkbox grids + number inputs in Sunday Review | **Prose fields** — intention, reflection, tiny win |
| Progress bars, trend lines, reports | **Plain lists** — diary-style session log, collapsible week cards |
| “Needs attention” / “Slightly behind” status | **No judgment states.** No red “you’re behind.” |
| Color-coded life pillars (Career/Finance/Passion/Body) | **Soft stage badges** on songs only — not a pillar dashboard |
| “Did you hit target?” framing | **“What shifted?”** framing — quality of attention, not minutes |
| Admin / execution OS energy | **Creative journal** energy — warm, human, slightly musical |

**Borrow from WeekOS (structure only):** dark theme discipline, clear tab nav, week context
selector, generous card spacing, mobile-friendly layout, password gate UX, Supabase persistence.

**Reject entirely:** anything that makes Rajon feel scored, behind, or on a streak.

---

## Design tokens (`:root`)

```css
:root {
  --bg-base: #0f0d0b;
  --bg-card: #1a1612;
  --bg-elevated: #231e18;
  --border: #2e2720;

  --accent-primary: #d4a84b;
  --accent-secondary: #8b6914;
  --accent-soft: #3d2f10;

  --text-primary: #f0ebe3;
  --text-secondary: #a89880;
  --text-muted: #6b5d4f;

  --stage-discovering: #4a7c59;
  --stage-learning: #4a6b8a;
  --stage-comfortable: #7a5c8a;
  --stage-recorded: #8a6b3a;
  --stage-shared: #d4a84b;
}
```

Tailwind preset → semantic utilities: `bg-base`, `bg-card`, `accent-primary`, `stage-*`, etc.
Never hardcode hex in app code.

---

## Typography (Hallmark-informed)

WeekOS reads as neutral SaaS (single sans, metric-heavy). Music OS should read as **editorial +
journal**:

- **Display:** a warm, characterful serif or serif-adjacent face (e.g. Fraunces, Lora, or
  similar) — headings, tab labels, song titles. Not Inter as display.
- **Body:** a refined sans for fields and coach chat (e.g. Source Sans 3, DM Sans).
- **Pair two faces minimum.** Display + body, different jobs.
- Sentence case labels. No ALL-CAPS category headers like WeekOS pillars.

---

## Voice & microcopy

Warm, human, encouraging. Lower the bar.

| ✅ Music OS | ❌ WeekOS / habit-tracker |
|---|---|
| "What shifted today?" | "Session notes" |
| "What's one thing that felt better?" | "Improvements" |
| "One tiny win this week" | "Weekly achievements" |
| "How are you feeling about it?" | "Rate your confidence 1–10" |
| unfocused / okay / solid / good flow / in the zone | 1–5 stars, "bad/good", % complete |
| nervous / neutral / excited | pass/fail, red/yellow/green mood |

**Banned UI:** streaks, day counters, completion rings, percentage scores, leaderboards,
numeric weekly targets, reward tiers, “needs attention” badges, trend charts on practice data.

---

## UI patterns by surface

### `/studio` — today's session (default tab)

**Feel:** opening a notebook before and after practice. Not filling a form for a manager.

**Before practice — Intention block**
- Soft card, generous padding, amber accent on focus — not a dense grid.
- Song picker: dropdown or pill list (current songs + "freestyle"), not a metric row.
- One short text field: "What's your one focus?" — placeholder like *"Just the chorus transition…"*
- Feeling chips: **nervous · neutral · excited** — three equal tappable pills, no red/green judgment.
- CTA: **Start Session** — warm amber button, not a blue SaaS primary.

**After practice — Reflection block**
- Appears after start (or always visible below — TBD in build; prefer gentle reveal).
- Open text areas, not number inputs. Placeholders invite story: *"What did you actually work on?"*
- Quality selector: **five word labels** in a horizontal row (unfocused → in the zone). Selecting
  one is logging how it *felt*, not scoring performance. No star icons if they feel like reviews.
- Optional "what felt stuck" — clearly skippable, muted styling.
- CTA: **Log Session** — confirmation copy like "Saved — nice showing up." not "Week score updated."

**Coach chat (below, always visible)**
- Inviting thread UI — not a sidebar widget buried in settings.
- Warm assistant bubbles; Rajon's messages right-aligned or distinct surface.
- Empty state: one line from the coach, e.g. *"What's on your mind after practice?"*
- Input feels like texting a mentor, not submitting a ticket.

### `/journey` — weekly reflection

**Feel:** Sunday journal entry, not Sunday Review scorecard.

- **This week's focus** — two prose fields at top of week (focus song/skill + desired feeling).
  No numeric targets.
- **Weekly reflection** — four prompts as stacked text areas. **Tiny win required** before save
  (gentle validation copy, not error red).
- **Session log** — vertical diary list: date · song · quality word · one-line reflection snippet.
  No graphs, no "Passion 0/14", no bar charts.
- **Month toggle** — past weeks as collapsible cards (week label, focus, one win, a feeling line).
  Not a reports dashboard.

### `/releases` — song tracker

**Feel:** creative portfolio shelf, not a CRM pipeline.

- Song cards: title + artist prominent (display type), stage as soft badge, comfort as quiet label.
- Stage colors from tokens — informational, not red=bad.
- Notes field reads like margin scribbles, not KPI comments.
- Optional target: helper text *"No deadline — just a north star if you want one."*
- No progress bars toward "100% learned."

### `/` — public home (Phase 3)

**Feel:** personal landing page, not a dashboard. Minimal. Let the music breathe.
Hallmark macrostructure: biased layout, real hierarchy, no purple-gradient hero, no fake stats.

---

## Layout & motion

- Mobile-first. Rajon logs from his phone after morning practice.
- Asymmetric bias where it helps (Hallmark: break centered-everything symmetry once).
- Generous vertical rhythm — journal pages breathe; WeekOS density is wrong here.
- Calm motion: gentle fades on block reveal. No gamified confetti, no streak animations.
- Spacing: named scale, multiples of 4. No arbitrary cramped metric grids.

---

## Hallmark — design skill (required for UI work)

Install before Phase 1 UI: [Hallmark](https://www.usehallmark.com/) — a design skill that
refuses AI-generated-looking UI.

```bash
npx skills add nutlope/hallmark
```

Cursor picks up `.cursor/rules/hallmark.mdc` automatically.

**When to use:**

| Phase | Hallmark verb | Purpose |
|---|---|---|
| Before first UI | **Build** or **Study** | Pick warm editorial direction; study a reference you love |
| During Phase 1–3 | **Build** | Landing/public home, Studio layout — macrostructure first |
| After each major surface | **Audit** | Punch list against slop patterns (purple hero, Inter-only, centered grids, icon-tile cards) |
| Public home polish | **Redesign** | Same content, different bones if first pass feels generic |

**Hallmark slop patterns to actively avoid in Music OS:**
1. Purple-to-pink gradient heroes → solid warm dark surfaces, amber accent only
2. Inter as display + body → paired display serif + body sans
3. Centered everything → biased journal layout
4. Icon-tile feature cards → prose-first blocks, asymmetric song cards
5. Default AI nav (logo left, links center, CTA right) → simple tab nav suited to a private journal app

Combine with gstack `design-review` / `design-consultation` for warm-dark token compliance.

---

## Empty & edge states

- No sessions yet: *"No entries yet — start with one intention."* Not "0 sessions this week."
- No songs: invite Add Song with pre-loaded Dylan example visible as inspiration.
- Coach offline / API error: warm fallback, not scary red error chrome.
- Skipped week: no "missed week" badge — week card simply empty or absent.

---

## Definition of done (design)

Before marking any UI phase complete:

- [ ] Passes Hallmark **audit** (or manual check against slop list above)
- [ ] No WeekOS patterns (scores, quotas, progress bars on practice)
- [ ] Microcopy matches voice table
- [ ] Mobile tap targets comfortable; Studio log flow completable one-handed
- [ ] Tokens only — no raw hex in components
