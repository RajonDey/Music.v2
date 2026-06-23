"use client";

import type { RecentSkill, SkillGroup } from "@/lib/practice";

export function SkillTagger({
  recentSkills,
  skillGroups,
  defaultSkillIds = [],
  maxRecent = 8,
}: {
  recentSkills: RecentSkill[];
  skillGroups: SkillGroup[];
  defaultSkillIds?: string[];
  maxRecent?: number;
}) {
  const selected = new Set(defaultSkillIds);
  const recentIds = new Set(recentSkills.map((s) => s.id));
  const visibleRecent = recentSkills.slice(0, maxRecent);

  return (
    <div className="space-y-3">
      {visibleRecent.length > 0 ? (
        <div>
          <p className="mb-2 text-xs text-muted">Recent — tap if you touched more</p>
          <div className="flex flex-wrap gap-2">
            {visibleRecent.map((skill) => (
              <label key={skill.id} className="cursor-pointer">
                <input
                  type="checkbox"
                  name="skills"
                  value={skill.id}
                  defaultChecked={selected.has(skill.id)}
                  className="peer sr-only"
                />
                <span className="inline-block rounded-full border border-border bg-elevated px-3.5 py-1.5 text-sm text-secondary transition duration-fast hover:border-border-strong peer-checked:border-accent peer-checked:bg-accent-soft peer-checked:text-primary">
                  {skill.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      ) : null}

      <details className="rounded-lg border border-border bg-elevated">
        <summary className="cursor-pointer list-none px-3.5 py-2.5 text-sm text-secondary transition hover:text-primary [&::-webkit-details-marker]:hidden">
          More…
        </summary>
        <div className="space-y-1.5 border-t border-border px-3.5 py-3">
          {skillGroups.map((group) => (
            <details key={group.category} className="rounded-lg border border-border bg-card">
              <summary className="cursor-pointer list-none px-3 py-2 text-xs text-secondary [&::-webkit-details-marker]:hidden">
                {group.category}
                <span className="text-muted"> · {group.skills.length}</span>
              </summary>
              <div className="flex flex-wrap gap-2 border-t border-border px-3 py-2">
                {group.skills
                  .filter((skill) => !recentIds.has(skill.id))
                  .map((skill) => (
                    <label key={skill.id} className="cursor-pointer">
                      <input
                        type="checkbox"
                        name="skills"
                        value={skill.id}
                        defaultChecked={selected.has(skill.id)}
                        className="peer sr-only"
                      />
                      <span className="inline-block rounded-full border border-border bg-elevated px-3 py-1.5 text-xs text-secondary transition duration-fast hover:border-border-strong peer-checked:border-accent peer-checked:bg-accent-soft peer-checked:text-primary">
                        {skill.name}
                      </span>
                    </label>
                  ))}
              </div>
            </details>
          ))}
        </div>
      </details>
    </div>
  );
}
