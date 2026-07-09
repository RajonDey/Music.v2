"use client";

import Link from "next/link";
import type { SkillDomain } from "@music/types";

const tabs: { domain: SkillDomain; label: string; href: string }[] = [
  { domain: "guitar", label: "Guitar", href: "/skills" },
  { domain: "vocal", label: "Vocal", href: "/skills?tab=vocal" },
];

export function SkillsDomainTabs({ active }: { active: SkillDomain }) {
  return (
    <div className="flex gap-2" role="tablist" aria-label="Skills domain">
      {tabs.map((tab) => {
        const isActive = tab.domain === active;
        return (
          <Link
            key={tab.domain}
            href={tab.href}
            role="tab"
            aria-selected={isActive}
            className={`rounded-full border px-4 py-2 text-sm transition duration-fast ${
              isActive
                ? "border-accent bg-accent-soft text-primary"
                : "border-border bg-elevated text-secondary hover:border-border-strong hover:text-primary"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
