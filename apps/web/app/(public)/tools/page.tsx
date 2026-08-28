/*
 * Hallmark · macrostructure: Index-First · tone: editorial
 * Public utility catalogue. Vertical setlist — not a card grid.
 * Gear / kit lives on /about#kit.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "@music/ui";
import { SiteFooter } from "@/components/public/SiteFooter";
import { Reveal } from "@/components/public/Reveal";
import { getLiveTools } from "@/lib/public-tools";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "Small things to play with — listed here as they ship. Not the kit behind the sound.",
};

export default function ToolsPage() {
  const tools = getLiveTools();

  return (
    <>
      <div className="mx-auto max-w-3xl px-6 pb-16 pt-32 sm:px-10">
        <SectionLabel className="mb-5">Tools</SectionLabel>
        <h1 className="font-display text-4xl tracking-[-0.02em] text-primary sm:text-5xl">
          At hand
        </h1>
        <p className="mt-6 max-w-prose text-[1.0625rem] leading-relaxed text-secondary">
          Small things to play with. Not the kit I use — that&apos;s on{" "}
          <Link
            href="/about#kit"
            className="text-secondary underline underline-offset-4 transition-colors hover:text-primary"
          >
            About
          </Link>
          .
        </p>

        {tools.length === 0 ? (
          <div className="mt-16 border-t border-border">
            <p className="pt-10 font-display text-2xl tracking-[-0.01em] text-muted">
              Nothing here yet.
            </p>
          </div>
        ) : (
          <ul className="mt-16">
            {tools.map((tool, i) => (
              <Reveal as="li" key={tool.slug} delay={i * 70}>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="group block border-t border-border py-10"
                >
                  <h2 className="font-display text-3xl tracking-[-0.02em] text-primary transition-colors group-hover:text-accent sm:text-4xl">
                    {tool.name}
                  </h2>
                  <p className="mt-3 max-w-prose leading-relaxed text-secondary">
                    {tool.lede}
                  </p>
                </Link>
              </Reveal>
            ))}
          </ul>
        )}
      </div>

      <SiteFooter />
    </>
  );
}
