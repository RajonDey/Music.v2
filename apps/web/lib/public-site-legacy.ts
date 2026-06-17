/**
 * Canonical public-site identity from music.rajondey.com (WordPress / RDMusic theme).
 * Source repo: https://github.com/RajonDey/Music — see docs/LEGACY_PUBLIC_SITE.md
 */
export const PUBLIC_SITE = {
  url: "https://music.rajondey.com",
  siteName: "Rajon Dey Music",
  alternateName: "RD Music",
  brandLine: "Feel the Sound",
  title: "Feel the Sound — Rajon Dey Music",
  description:
    "Rajon Dey Music — RD Beats, Feel the Sound. Explore the music journey of Rajon Dey, blending code and melody.",
  ogDescription:
    "Explore Rajon Dey's musical journey through captivating guitar melodies for creativity and soul healing.",
  keywords: [
    "Rajon Dey Music",
    "RD Beats",
    "Feel the Sound",
    "Rajon",
    "Rajon Dey",
  ],
  tagline:
    "Every masterpiece begins with a single note—It takes time to even play something recognizable!",
  social: {
    soundcloud: "https://soundcloud.com/rajondey",
    youtube: "https://www.youtube.com/@rajjondey",
    instagram: "https://www.instagram.com/rajjon.dey/",
  },
  assets: {
    favicon32: "/brand/favicon-32x32.png",
    icon192: "/brand/icon-192x192.png",
    appleTouchIcon: "/brand/apple-touch-icon.png",
    ogImage: "/brand/og-image.png",
    /** Landscape 1200x630 social share card (OG/Twitter). */
    ogCover: "/brand/og-cover.png",
    /** Banner video pulled from the legacy WP theme, now self-hosted (~20MB). */
    heroVideo: "/video/rdmusic-banner.mp4",
    /** Poster frame extracted from the banner video (fallback + reduced-motion). */
    heroPoster: "/video/rdmusic-banner-poster.jpg",
  },
  analytics: {
    googleTagManager: "GTM-K92RXR7T",
  },
  legacyRepo: "https://github.com/RajonDey/Music",
} as const;
