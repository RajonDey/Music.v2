# Legacy public site — preservation reference

This doc captures everything worth carrying forward from the live WordPress site at
[music.rajondey.com](https://music.rajondey.com) and the source repo
[RajonDey/Music](https://github.com/RajonDey/Music).

**Do not delete the GitHub repo.** It is the historical public face, custom theme source,
and SEO anchor. Music.v2 reuses its identity on the same domain when Next.js replaces WordPress.

## Local mirror (not committed)

Clone for reference only — already in `.gitignore`:

```bash
git clone https://github.com/RajonDey/Music.git .legacy/Music
```

The repo is a WordPress `wp-content` export (themes, plugins, uploads). WordPress core and
`wp-config.php` are excluded via `.gitignore` in that repo.

## Custom theme: `RDMusic`

Path in legacy repo: `themes/RDMusic/`

| File | What it holds |
|------|----------------|
| `header.php` | Title, meta description, keywords, OG tags, canonical |
| `template-parts/header-section.php` | Hero copy: "Feel the Sound!" + tagline |
| `template-parts/social-menu.php` | SoundCloud, YouTube, Instagram links |
| `template-parts/background-video.php` | Hero video banner |
| `template-parts/newsletter.php` | Beehiiv embed (currently commented in theme; live site uses iframe) |
| `style.css` | Theme metadata + Spotify-green palette (`#1db954`) |

Music.v2 uses **warm amber tokens** for Music OS — Phase 3 public home should feel editorial,
not a pixel copy of the old green WP theme. Copy and SEO identity carry over; visual refresh is intentional.

## SEO & metadata (live site, Rank Math + theme)

Extracted 2026-06-16 from production HTML:

| Field | Value |
|-------|--------|
| Site name | RD Beats |
| Alternate name | Rajon's Music |
| Title | Rajon Dey Music — Feel the Sound / Home - RD Beats |
| Meta description | Rajon Dey Music - RD Beats, Feel the Sound. Explore the music journey of Rajon Dey, blending code and melody. |
| OG description | Explore Rajon Dey's musical journey through captivating guitar melodies for creativity and soul healing. |
| Keywords | Rajon Dey Music, RD Beats, Feel the Sound, Rajon, Rajon Dey |
| Canonical | https://music.rajondey.com/ |
| OG image | https://music.rajondey.com/wp-content/uploads/2025/05/2.png (500×500) |
| Robots | index, follow (public `/` only in Music.v2) |
| JSON-LD | Person + Organization + WebSite + WebPage (Rank Math) |

### Favicon / app icons (committed to Music.v2)

Downloaded from live uploads into `apps/web/public/brand/`:

- `favicon-32x32.png` ← `cropped-2-32x32.png`
- `icon-192x192.png` ← `cropped-2-192x192.png`
- `apple-touch-icon.png` ← `cropped-2-180x180.png`
- `og-image.png` ← `2.png`

### Analytics

- Google Tag Manager: `GTM-K92RXR7T` (on live WP site)
- **Not wired in Music.v2 yet** — add only when Rajon explicitly wants tracking on the new stack.

## Social links (canonical)

| Platform | URL |
|----------|-----|
| SoundCloud | https://soundcloud.com/rajondey |
| YouTube | https://www.youtube.com/@rajjondey |
| Instagram | https://www.instagram.com/rajjon.dey/ |

## Hero / media assets

| Asset | Status |
|-------|--------|
| Banner video | Live: `…/themes/RDMusic/assets/video/rdmusic-banner.mp4` — not in GitHub repo; re-host in Phase 3 if reused |
| Fallback image | 404 on live server — missing from repo too |
| Beehiiv newsletter | `embeds.beehiiv.com/c893af3a-…` — optional Phase 3+ (feature gate if re-enabled) |

## Music.v2 implementation map

| Legacy concern | Music.v2 location |
|----------------|-------------------|
| SEO constants | `apps/web/lib/public-site-legacy.ts` |
| Next.js metadata + icons | `apps/web/app/layout.tsx` |
| JSON-LD | `apps/web/components/public/PublicSiteJsonLd.tsx` |
| robots.txt | `apps/web/app/robots.ts` (blocks private routes + `/api/`) |
| sitemap.xml | `apps/web/app/sitemap.ts` |
| AI / LLM discovery | `apps/web/app/llms.txt/route.ts` → `/llms.txt` |
| Private routes noindex | `apps/web/app/(private)/layout.tsx` |
| Brand PNGs | `apps/web/public/brand/` |

## Migration checklist (when WordPress → Next.js cutover)

1. **Keep domain** `music.rajondey.com` on Vercel — same URL preserves Google equity.
2. **Match canonical URLs** — `/` only for public; no stray WP paths unless 301 redirects added.
3. **301 redirects** if any WP URLs were indexed (check Search Console); single-page site likely minimal.
4. **Search Console** — verify new property / same property, submit sitemap, request re-index of `/`.
5. **GTM** — migrate container or replace with simpler analytics if desired.
6. **Archive GitHub repo** — mark read-only / add README pointer to Music.v2; do not delete history.
7. **Hallmark audit** Phase 3 public UI — warm editorial, not WP clone.

## AI discoverability

`/llms.txt` follows the emerging convention for LLM crawlers (ChatGPT, Perplexity, etc.):
plain-text summary, social links, canonical URLs, keywords. Combined with JSON-LD and open
robots on `/`, the public home stays legible to both Google and AI answer engines.

Private Music OS routes (`/studio`, `/journey`, `/releases`, `/login`, `/api/*`) are
**disallowed** in `robots.ts` and **noindex** on private layout.
