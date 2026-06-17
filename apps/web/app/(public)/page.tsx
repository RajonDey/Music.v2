/*
 * Hallmark · genre: atmospheric · macrostructure: Photographic
 * theme: Lumen Night Foundry (studied-DNA — warm dark amber-gold)
 * H6 knobs: area=full-bleed VIDEO, text=overlaid, anchor=lower-left
 * Single-viewport, no-scroll splash. Banner video behind, warm scrims over.
 * Nav provided by (public)/layout.tsx.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "@music/ui";
import { PUBLIC_SITE } from "@/lib/public-site-legacy";
import { BannerVideo } from "@/components/public/BannerVideo";
import { NewsletterEmbed } from "@/components/public/NewsletterEmbed";

export const metadata: Metadata = {
  title: PUBLIC_SITE.title,
  description: PUBLIC_SITE.description,
  openGraph: {
    title: PUBLIC_SITE.title,
    description: PUBLIC_SITE.ogDescription,
    url: PUBLIC_SITE.url,
    siteName: PUBLIC_SITE.siteName,
    images: [{ url: PUBLIC_SITE.assets.ogCover, width: 1200, height: 630 }],
    type: "website",
  },
};

const socials = [
  { label: "SoundCloud", href: PUBLIC_SITE.social.soundcloud },
  { label: "YouTube", href: PUBLIC_SITE.social.youtube },
  { label: "Instagram", href: PUBLIC_SITE.social.instagram },
];

const legal = [
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms-of-use" },
  { label: "Cookies", href: "/cookies-policy" },
];

export default function PublicHomePage() {
  return (
    <section className="hero-over-video relative h-dvh w-full overflow-hidden">
      {/* Keeps the fixed nav readable over the video in light mode */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-24 bg-gradient-to-b from-black/55 to-transparent"
      />

      <BannerVideo />

      {/* ── Scrims ─────────────────────────────────────────────
       *  Layered darkening so copy stays readable over blue stage lighting.
       * ──────────────────────────────────────────────────────── */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/20"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(130%_90%_at_0%_100%,rgba(0,0,0,0.82),transparent_58%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(75%_55%_at_85%_0%,rgba(212,168,75,0.22),transparent_55%)]"
      />

      {/* ── Overlaid content, anchored lower-left ──────────────── */}
      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-7 pt-24 sm:px-10 sm:pb-9 lg:px-16 lg:pb-11">
        <div className="max-w-5xl animate-rise">
          <SectionLabel onDark className="mb-4">
            Rajon Dey · guitar &amp; vocals
          </SectionLabel>

          <h1 className="font-display text-6xl leading-[0.9] tracking-[-0.03em] text-primary drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)] sm:text-7xl md:text-8xl lg:text-[8.5rem]">
            Feel the
            <br />
            Sound
          </h1>

          <p className="hero-copy mt-5 max-w-lg text-base leading-relaxed text-primary sm:text-lg">
            Every masterpiece begins with a single note — it takes time to even
            play something recognizable.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            {socials.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-copy group flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-accent-strong"
              >
                {label}
                <span
                  aria-hidden
                  className="inline-block transition-transform group-hover:translate-x-0.5"
                >
                  ↗
                </span>
              </a>
            ))}
          </div>

          {/* Slim Beehiiv subscribe — compact enough for the no-scroll splash */}
          <div className="mt-7 max-w-sm">
            <p className="hero-copy mb-2.5 text-sm text-primary">
              Get a note when I share something worth hearing.
            </p>
            <NewsletterEmbed />
          </div>
        </div>

        {/* Compact legal line — replaces the footer on this no-scroll page */}
        <div className="hero-copy mt-8 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-secondary">
          <span>© {new Date().getFullYear()} Rajon Dey</span>
          {legal.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="transition-colors hover:text-primary"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
