"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "@music/ui";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function PublicHeader() {
  const pathname = usePathname();
  const overVideo = pathname === "/";

  const linkClass = overVideo
    ? "text-xs text-white/95 transition-colors hover:text-white sm:text-sm"
    : "text-xs text-primary/80 transition-colors hover:text-primary sm:text-sm";

  const toggleClass = overVideo
    ? "ml-1 border-white/30 px-2 text-white/95 hover:border-white/45 hover:text-white"
    : "ml-1 border-transparent px-2";

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="flex items-center justify-between px-6 py-5 sm:px-10 lg:px-16">
        <Link href="/" aria-label="Rajon Dey Music — home">
          <Brand className={overVideo ? "[&_span:last-child]:text-white" : undefined} />
        </Link>
        <nav aria-label="Main" className="flex items-center gap-3 sm:gap-4">
          <Link href="/blog" className={linkClass}>
            Blog
          </Link>
          <Link href="/tools" className={linkClass}>
            Tools
          </Link>
          <Link href="/about" className={linkClass}>
            About
          </Link>
          <ThemeToggle className={toggleClass} />
        </nav>
      </div>
    </header>
  );
}
