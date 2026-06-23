import Link from "next/link";
import type { SkillStandPayload } from "@/lib/stand";

export function SkillStand({ payload }: { payload: SkillStandPayload }) {
  const { skill } = payload;

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-muted">{skill.category}</p>
        <h1 className="font-display text-2xl tracking-tightish text-primary sm:text-3xl">
          {skill.name}
        </h1>
        <p className="text-sm text-secondary">
          Take your time — use the metronome if it helps.
        </p>
      </header>

      <Link
        href="/skills"
        className="inline-flex text-sm text-accent transition hover:text-accent-strong"
      >
        Open in Skills Lab →
      </Link>
    </div>
  );
}
