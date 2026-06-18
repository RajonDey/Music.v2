import type { Metadata } from "next";
import Link from "next/link";
import { Brand } from "@music/ui";
import { PrivateNav } from "@/components/nav/PrivateNav";
import { NavRail } from "@/components/nav/NavRail";
import { TodayLine } from "@/components/nav/TodayLine";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh lg:flex">
      {/* Desktop side-rail */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card/60 px-5 py-6 backdrop-blur lg:flex">
        <Link href="/studio" aria-label="Music OS home" className="px-1">
          <Brand />
        </Link>
        <div className="mt-2 px-1">
          <TodayLine />
        </div>
        <div className="mt-8">
          <NavRail />
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-4">
          <Link
            href="/"
            className="text-sm text-secondary transition hover:text-primary"
          >
            View site <span aria-hidden>&rarr;</span>
          </Link>
          <ThemeToggle className="border-transparent px-2" />
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-base/85 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <Link href="/studio" aria-label="Music OS home">
            <Brand />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle className="border-transparent px-2" />
            <Link
              href="/"
              className="text-sm text-secondary transition hover:text-primary"
            >
              View site <span aria-hidden>&rarr;</span>
            </Link>
          </div>
        </div>
        <div className="mt-1">
          <TodayLine />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 lg:pl-64">
        <main className="mx-auto max-w-6xl animate-fade px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-14 lg:pt-10">
          {children}
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <PrivateNav />
    </div>
  );
}
