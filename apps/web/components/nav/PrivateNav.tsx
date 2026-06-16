"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/studio", label: "Studio" },
  { href: "/journey", label: "Journey" },
  { href: "/releases", label: "Releases" },
];

export function PrivateNav() {
  const pathname = usePathname();

  return (
    <nav
      className="mt-4 flex gap-2 rounded-xl border border-border bg-card p-1"
      aria-label="Main"
    >
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          aria-current={pathname.startsWith(tab.href) ? "page" : undefined}
          className="flex-1 rounded-lg px-3 py-2.5 text-center text-sm text-secondary transition hover:bg-elevated hover:text-primary aria-[current=page]:bg-accent-soft aria-[current=page]:text-primary"
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
