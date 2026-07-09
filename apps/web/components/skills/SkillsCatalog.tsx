"use client";

import { useMemo, useState } from "react";
import { TextInput } from "@music/ui";
import type { SkillCategoryGroup } from "@/lib/skills";
import { SkillRow } from "@/components/skills/SkillRow";

export function SkillsCatalog({ groups }: { groups: SkillCategoryGroup[] }) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();

  const filteredGroups = useMemo(() => {
    if (!normalized) return groups;
    return groups
      .map((group) => ({
        ...group,
        skills: group.skills.filter(
          (skill) =>
            skill.name.toLowerCase().includes(normalized) ||
            group.category.toLowerCase().includes(normalized),
        ),
      }))
      .filter((group) => group.skills.length > 0);
  }, [groups, normalized]);

  return (
    <div className="space-y-4">
      <div className="max-w-md">
        <TextInput
          id="skills-search"
          name="skills-search"
          type="search"
          placeholder="Find a skill to open its notebook…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search skills"
        />
      </div>

      {filteredGroups.length === 0 ? (
        <p className="text-sm text-muted">No skills match &ldquo;{query}&rdquo;.</p>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2 lg:items-start">
          {filteredGroups.map((group) => {
            const done = group.skills.filter(
              (s) =>
                (s.tier === "milestone" && s.milestone_done) ||
                (s.tier === "progress" && (s.progress_value ?? 0) > 0) ||
                (s.tier === "evergreen" && s.moments_count > 0),
            ).length;
            return (
              <details
                key={group.category}
                className="rounded-2xl border border-border bg-card"
                open={normalized.length > 0 ? true : undefined}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
                  <span className="font-display text-lg text-primary">{group.category}</span>
                  <span className="shrink-0 text-xs text-muted">
                    {done}/{group.skills.length} touched
                  </span>
                </summary>
                <div className="border-t border-border px-5 py-2">
                  {group.skills.map((skill) => (
                    <SkillRow key={skill.id} skill={skill} />
                  ))}
                </div>
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}
