import Link from "next/link";
import { Brand } from "@music/ui";

/**
 * Ft2 — inline rule single line.
 * Wordmark + tagline left, legal links right. Used on scrolling public
 * pages (about, blog, tools, legal). The no-scroll home splash renders its
 * own compact legal line instead.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="flex flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
        <div className="flex items-center gap-3 text-xs text-secondary">
          <Brand />
          <span aria-hidden>·</span>
          <span>Feel the Sound</span>
          <span aria-hidden>·</span>
          <span>{new Date().getFullYear()}</span>
        </div>

        <nav
          aria-label="Legal"
          className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-secondary"
        >
          <Link
            href="/privacy-policy"
            className="transition-colors hover:text-primary"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-of-use"
            className="transition-colors hover:text-primary"
          >
            Terms of Use
          </Link>
          <Link
            href="/cookies-policy"
            className="transition-colors hover:text-primary"
          >
            Cookies Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
