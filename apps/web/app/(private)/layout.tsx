import type { Metadata } from "next";
import Link from "next/link";
import { Brand } from "@music/ui";
import { PrivateNav } from "@/components/nav/PrivateNav";
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
    <div className="mx-auto min-h-dvh max-w-2xl px-4 pb-28 pt-5 sm:pb-12 sm:pt-7">
      <header className="mb-8">
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
        <div className="mt-1.5 pl-[2.6rem]">
          <TodayLine />
        </div>
        <div className="mt-5">
          <PrivateNav />
        </div>
      </header>
      <main className="animate-fade">{children}</main>
    </div>
  );
}
