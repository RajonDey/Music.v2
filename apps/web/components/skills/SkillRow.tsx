import Link from "next/link";
import type { SkillWithState } from "@/lib/skills";
import { SkillStateControls } from "@/components/skills/SkillStateControls";

export function SkillRow({
  skill,
  showLink = true,
}: {
  skill: SkillWithState;
  showLink?: boolean;
}) {
  const hasMaterial = skill.has_practice_note || skill.resources_count > 0;

  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-2.5 last:border-0">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {showLink ? (
          <Link
            href={`/skills/${skill.id}`}
            className="truncate text-sm text-secondary transition hover:text-primary"
          >
            {skill.name}
          </Link>
        ) : (
          <span className="truncate text-sm text-secondary">{skill.name}</span>
        )}
        {hasMaterial ? (
          <span
            className="shrink-0 text-xs text-muted"
            title="Saved practice material"
            aria-label="Has saved practice material"
          >
            ◆
          </span>
        ) : null}
      </div>
      <div className="shrink-0">
        <SkillStateControls skill={skill} />
      </div>
    </div>
  );
}
