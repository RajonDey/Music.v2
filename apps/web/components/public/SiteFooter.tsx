import type { ReactNode } from "react";
import Link from "next/link";
import { Brand } from "@music/ui";
import { PUBLIC_SITE } from "@/lib/public-site-legacy";

/** Shared legal links — keep home splash and SiteFooter in sync. */
export const LEGAL_LINKS = [
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms-of-use" },
  { label: "Cookies", href: "/cookies-policy" },
] as const;

const explore = [
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Tools", href: "/tools" },
] as const;

const listen = [
  { label: "SoundCloud", href: PUBLIC_SITE.social.soundcloud, external: true },
  { label: "YouTube", href: PUBLIC_SITE.social.youtube, external: true },
  { label: "Instagram", href: PUBLIC_SITE.social.instagram, external: true },
  { label: "rajondey.com", href: "https://rajondey.com", external: true },
] as const;

function Column({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted">
        {title}
      </p>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: ReactNode;
}) {
  const className =
    "group inline-flex items-center gap-1 text-sm text-secondary transition-colors hover:text-primary";

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
        <span
          aria-hidden
          className="inline-block text-muted transition-transform group-hover:translate-x-0.5"
        >
          ↗
        </span>
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/**
 * Ft3 — index-style columns + bottom credit line.
 * Used on scrolling public pages. Home splash keeps its own slim legal line
 * (same LEGAL_LINKS) so the no-scroll viewport stays intact.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-10 lg:px-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 sm:gap-12">
          <Column title="Explore">
            {explore.map(({ label, href }) => (
              <li key={href}>
                <FooterLink href={href}>{label}</FooterLink>
              </li>
            ))}
          </Column>

          <Column title="Listen">
            {listen.map(({ label, href }) => (
              <li key={href}>
                <FooterLink href={href} external>
                  {label}
                </FooterLink>
              </li>
            ))}
          </Column>

          <Column title="Legal">
            {LEGAL_LINKS.map(({ label, href }) => (
              <li key={href}>
                <FooterLink href={href}>{label}</FooterLink>
              </li>
            ))}
          </Column>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-secondary">
            <Link href="/" aria-label="Rajon Dey Music — home">
              <Brand subtle className="[&_span:last-child]:text-sm" />
            </Link>
            <span aria-hidden className="text-muted">
              ·
            </span>
            <span>{PUBLIC_SITE.brandLine}</span>
          </div>
          <p className="text-xs text-muted">© {year} Rajon Dey</p>
        </div>
      </div>
    </footer>
  );
}
