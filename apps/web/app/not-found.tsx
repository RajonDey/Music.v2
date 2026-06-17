import type { Metadata } from "next";
import Link from "next/link";
import { Brand } from "@music/ui";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <Link href="/" aria-label="Rajon Dey Music — home" className="mb-10">
        <Brand />
      </Link>

      <p className="font-display text-7xl tracking-[-0.03em] text-accent sm:text-8xl">
        404
      </p>
      <h1 className="mt-4 font-display text-3xl tracking-[-0.02em] text-primary sm:text-4xl">
        This note didn&apos;t land
      </h1>
      <p className="mt-4 max-w-md leading-relaxed text-secondary">
        The page you were looking for isn&apos;t here — maybe it moved, maybe it
        never existed. Let&apos;s get you back to the music.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <Link
          href="/"
          className="text-sm font-medium text-accent transition-colors hover:text-accent-strong"
        >
          <span aria-hidden>←</span> Back home
        </Link>
        <Link
          href="/blog"
          className="text-sm text-secondary transition-colors hover:text-primary"
        >
          Read the blog
        </Link>
        <Link
          href="/about"
          className="text-sm text-secondary transition-colors hover:text-primary"
        >
          About
        </Link>
      </div>
    </main>
  );
}
