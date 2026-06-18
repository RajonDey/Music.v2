"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, isNavActive } from "./navItems";

export function NavRail() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1" aria-label="Main">
      {NAV_ITEMS.map((item) => {
        const active = isNavActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition duration-base ${
              active
                ? "bg-accent-soft text-primary shadow-sm"
                : "text-secondary hover:bg-elevated hover:text-primary"
            }`}
          >
            <span
              className={`h-5 w-5 shrink-0 transition ${
                active ? "text-accent" : "text-muted group-hover:text-accent"
              }`}
            >
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
