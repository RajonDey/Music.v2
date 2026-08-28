# UI context

Warm, creative, slightly musical. **Journal + creative space**, not a productivity dashboard. Same token family as Weekly OS structurally (dark cards, tabs) but **not** its soul (scores, quotas, “behind”).

Defined in `packages/tokens` (`globals.css` + Tailwind preset). Consumed by `apps/web`.

## Theme

**Light and dark both exist.** Default is **light** (`data-theme="light"`, `lib/theme.ts`). Toggle stores `music-theme` in localStorage. Design docs that say “dark only” are stale.

Hero home forces light-on-video via `.hero-over-video` regardless of theme.

## Colors (tokens — do not copy hex into components)

| Role | CSS variable | Tailwind |
| --- | --- | --- |
| Page | `--bg-base` | `bg-base` |
| Card | `--bg-card` | `bg-card` |
| Elevated | `--bg-elevated` | `bg-elevated` |
| Border | `--border`, `--border-strong` | `border-border` |
| Text | `--text-primary/secondary/muted` | `text-primary`, `text-secondary`, `text-muted` |
| Accent | `--accent-primary/strong/soft/secondary` | `text-accent`, `bg-accent`, `bg-accent-soft` |
| Song stages | `--stage-*` | `stage-discovering`, … |

Dark accent is amber/gold (`#d4a84b` family). Light accent is a deeper gold. Never cold productivity blue. Never purple-gradient heroes.

## Typography

| Role | Face | Variable / class |
| --- | --- | --- |
| Display | Fraunces | `--font-display` / `font-display` |
| Body | Source Sans 3 | `--font-body` / `font-body` |

Loaded in `app/layout.tsx`. Not Inter-for-everything. Sentence case labels. No ALL-CAPS pillar headers.

## Radius and motion

Preset: `rounded-lg` / `xl` / `2xl`. Motion: `--dur-fast/base/slow`, `animate-fade` / rise. Respect `prefers-reduced-motion`. No streak confetti.

## Voice

Warm, human, lower the bar.

| Use | Avoid |
|---|---|
| “What shifted today?” | “Session notes” |
| “What’s one thing that felt better?” | “Improvements” |
| Quality words: unfocused → in the zone | Stars, % complete |
| Feeling chips: nervous / neutral / excited | Pass/fail mood |

**Banned UI:** streaks, day counters, completion rings, percentage scores, leaderboards, numeric weekly targets, reward tiers, “needs attention,” trend charts **as judgment**. Report may show calm month counts, a calendar, and approved radars/trends (feature-gate overrides in `context/decisions.md`) — never “you missed a day.”

Public tools copy must never say “improve your skills.”

## Layout patterns

- **Private:** side-rail (lg+) + mobile bottom tabs; `max-w-6xl`; padding room for the tab bar (`pb-28` on mobile)
- **Studio idle:** riyaz block above full-session picker; coach + metronome in a side column on large screens
- **Studio active:** fullscreen Stand overlay; nav chrome hidden until the session ends
- **Song Room:** two tabs — Songs List (Drift) and Songs Notebook; categories as dropdown + headings, never a third tab row
- **Public:** fixed header (Blog / Tools / About); home is a no-scroll splash with its own legal line; other pages use `SiteFooter`
- **Tools index:** vertical setlist (“At hand”), one row per tool — not a 2×2 icon grid
- **Tools detail:** `ToolFrame` (back + display name + lede) then the instrument

Mobile-first. Practice is logged from a phone.

## Component library

`packages/ui`: Button, Card, Brand, SectionLabel, and related primitives. Feature screens compose these; do not add a second design system.

## Icons

Inline SVGs in nav; stroke-based. No mascot icon-tile feature cards (Hallmark).

## Empty & edge states

- No sessions yet: *"No entries yet — start with one intention."* Not "0 sessions this week."
- No songs: invite Add Song; Dylan seed is inspiration, not a quota.
- Coach offline / API error: warm fallback, not scary red chrome.
- Empty public tools list: one quiet line, not ghost "coming soon" tiles.
- No "missed week" / "you skipped" badges.

## Hallmark

Use the hallmark skill for build/audit/redesign. Avoid: purple heroes, Inter-only, centered-everything, icon-tile cards, default SaaS nav.

Before marking UI done: Hallmark audit (or slop list), no WeekOS patterns, voice matches this file, Studio completable one-handed, tokens only.
