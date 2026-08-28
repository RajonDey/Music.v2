# Public site (as built)

Public chrome: `PublicHeader` (Blog, Tools, About + theme toggle). Home is a splash over the banner video; scrolling pages add `SiteFooter`.

The original brief said “one page, no blog.” **As built there is a blog, about, tools, and legal pages.**

## Surfaces

| URL | Job |
|---|---|
| `/` | Feel the Sound splash — hero video, brand line, social |
| `/about` | About; **kit/gear at `#kit`** (not a tool) |
| `/blog`, `/blog/[slug]` | Posts from `lib/blog.ts` |
| `/tools` | Utility catalogue — see `domains/tools.md` |
| `/privacy-policy`, `/terms-of-use`, `/cookies-policy` | Legal (`LegalPage`) |
| `/robots.txt`, `/sitemap.xml`, `/llms.txt` | SEO; sitemap includes live tools + posts |
| `/manifest` | PWA manifest |

Private Music OS is `noindex`.

## Rules

- No session logs, reflections, or coach chat
- Shared tokens (light/dark). Home overlay uses `.hero-over-video` for contrast
- GTM `GTM-K92RXR7T` is wired in root layout

## Identity / legacy

Constants: `apps/web/lib/public-site-legacy.ts`. Brand files: `apps/web/public/brand/`. Hero: `public/video/rdmusic-banner.mp4`. Historical WP notes: `context/domains/legacy-public.md`. Do not delete [RajonDey/Music](https://github.com/RajonDey/Music). Visual language is warm amber, not the old Spotify-green WP theme.

Social: SoundCloud, YouTube `@rajjondey`, Instagram `rajjon.dey`.

## Not built

Phase 4 auto-surface of `songs` with `is_shared` / current learning song on the home splash.

## Entry points

- `app/(public)/`, `app/layout.tsx`, `components/public/`
- `lib/public-site-legacy.ts`, `lib/blog.ts`
