"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type Tab = {
  href: string;
  label: string;
  icon: ReactNode;
};

const tabs: Tab[] = [
  {
    href: "/studio",
    label: "Studio",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M9 18V5l11-2v13" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="17" cy="16" r="3" />
      </svg>
    ),
  },
  {
    href: "/journey",
    label: "Journey",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path
          d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M9 7h6M9 11h4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/releases",
    label: "Releases",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="2.4" />
      </svg>
    ),
  },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PrivateNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop / tablet — inline tabs */}
      <nav
        className="hidden gap-1 rounded-xl border border-border bg-card p-1 sm:flex"
        aria-label="Main"
      >
        {tabs.map((tab) => {
          const active = isActive(pathname, tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm transition duration-base ${
                active
                  ? "bg-accent-soft text-primary shadow-sm"
                  : "text-secondary hover:bg-elevated hover:text-primary"
              }`}
            >
              <span className="h-4 w-4 text-accent">{tab.icon}</span>
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile — sticky bottom tab bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur sm:hidden"
        aria-label="Main"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto flex max-w-2xl">
          {tabs.map((tab) => {
            const active = isActive(pathname, tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-xs transition ${
                  active ? "text-accent" : "text-muted hover:text-secondary"
                }`}
              >
                <span className="h-5 w-5">{tab.icon}</span>
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
