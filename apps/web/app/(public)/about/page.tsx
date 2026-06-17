import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "@music/ui";
import { PUBLIC_SITE } from "@/lib/public-site-legacy";
import { SiteFooter } from "@/components/public/SiteFooter";
import { NewsletterEmbed } from "@/components/public/NewsletterEmbed";
import { Reveal } from "@/components/public/Reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Rajon Dey — software engineer by day, learning guitar and voice by morning. Music for the joy of it.",
};

export default function AboutPage() {
  return (
    <>
      <div className="px-6 pb-20 pt-32 sm:px-10 lg:px-16">
      {/*
       * Two columns on large screens:
       * — Left: the story (main column, ~60ch)
       * — Right: the connect section (smaller, anchored top)
       */}
      <div className="mx-auto grid max-w-5xl gap-16 lg:grid-cols-[1fr_260px] lg:gap-24">
        {/* ── Story ─────────────────────────────────────────── */}
        <div>
          <SectionLabel className="mb-5">About</SectionLabel>
          <h1 className="font-display text-4xl leading-tight tracking-[-0.02em] text-primary sm:text-5xl">
            A learner,
            <br />
            always.
          </h1>

          <div className="mt-10 space-y-5 text-base leading-relaxed text-secondary sm:text-[1.0625rem]">
            <p>
              Music has always been a passion, but for the last few years
              life&apos;s demands made it hard to find the time to create. Yet
              my connection to music runs deep — it&apos;s through melodies that
              I find fulfillment and peace.
            </p>
            <p>
              My guitar is not just an instrument. It&apos;s a source of
              creativity, energy, and focus. It has a way of calming me down and
              giving me clarity when I need it most.
            </p>
            <p>
              I am not an expert, nor do I aspire to be. I will always be a
              learner — embracing the journey of growth and discovery in music.
            </p>
            <p>
              This journey isn&apos;t just about me. It&apos;s about creating
              music that touches souls and brings a little healing. If you feel
              the pull to be part of this, stay tuned. Let&apos;s create
              something meaningful together.
            </p>
          </div>

          <div className="mt-10 border-t border-border pt-8 text-sm text-secondary">
            Questions, feedback, or just to say hi —{" "}
            <a
              href="https://rajondey.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary underline underline-offset-4 transition-colors hover:text-primary"
            >
              find me over at rajondey.com
            </a>
            .
          </div>
        </div>

        {/* ── Connect ───────────────────────────────────────── */}
        <aside className="space-y-8 lg:pt-[6.5rem]">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-secondary">
              Listen
            </p>
            <ul className="space-y-2">
              {[
                { label: "SoundCloud", href: PUBLIC_SITE.social.soundcloud },
                { label: "YouTube", href: PUBLIC_SITE.social.youtube },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1.5 text-sm text-secondary transition-colors hover:text-primary"
                  >
                    {label}
                    <span
                      aria-hidden
                      className="inline-block text-muted transition-transform group-hover:translate-x-0.5"
                    >
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-secondary">
              Follow
            </p>
            <ul className="space-y-2">
              {[
                {
                  label: "Instagram",
                  href: PUBLIC_SITE.social.instagram,
                },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1.5 text-sm text-secondary transition-colors hover:text-primary"
                  >
                    {label}
                    <span
                      aria-hidden
                      className="inline-block text-muted transition-transform group-hover:translate-x-0.5"
                    >
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-secondary">
              Also
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-secondary transition-colors hover:text-primary"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/tools"
                  className="text-sm text-secondary transition-colors hover:text-primary"
                >
                  Tools
                </Link>
              </li>
            </ul>
          </div>
        </aside>
        </div>
      </div>

      {/* ── Newsletter ─────────────────────────────────────────── */}
      <section
        className="border-t border-border px-6 py-20 sm:px-10 lg:px-16"
        aria-labelledby="newsletter-heading"
      >
        <div className="mx-auto max-w-5xl">
          <Reveal className="max-w-xl">
            <SectionLabel className="mb-5">Stay in touch</SectionLabel>
            <h2
              id="newsletter-heading"
              className="font-display text-3xl tracking-[-0.02em] text-primary sm:text-4xl"
            >
              Join the journey
            </h2>
            <p className="mt-4 max-w-prose leading-relaxed text-secondary">
              When something worth sharing happens — a song that clicked, a
              shift in the practice, a reflection worth passing on — it lands
              here first. No noise.
            </p>

            <NewsletterEmbed className="mt-8 max-w-md" />
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
