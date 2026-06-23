import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@music/ui";
import type { Song, Session } from "@music/types";
import { getStudioData, type SkillGroup } from "@/lib/practice";
import { getLoggedSession, resolveSessionAnchor } from "@/lib/session";
import { updateLoggedSession } from "@/app/(private)/studio/actions";
import { SessionReflectionForm } from "@/components/session/SessionReflectionForm";
import { DeleteLoggedSessionButton } from "@/components/session/DeleteLoggedSessionButton";

export const dynamic = "force-dynamic";

function formatDate(value: string): string {
  const d = new Date(`${value}T12:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function anchorSummary(
  session: Session,
  songs: Song[],
  skillGroups: SkillGroup[],
  skillIds: string[],
): string {
  const anchor = resolveSessionAnchor(session);
  switch (anchor) {
    case "song": {
      const song = songs.find((s) => s.id === session.song_id);
      const focus = session.song_focus ? ` (${session.song_focus})` : "";
      return song ? `Song · ${song.name}${focus}` : "Song";
    }
    case "guitar_skill": {
      const skillId = session.anchor_skill_id ?? skillIds[0] ?? null;
      if (!skillId) return "Guitar craft";
      for (const group of skillGroups) {
        const skill = group.skills.find((s) => s.id === skillId);
        if (skill) return `Guitar · ${skill.name}`;
      }
      return "Guitar craft";
    }
    case "vocal":
      return "Vocal";
    case "freestyle":
      return "Freestyle";
  }
}

export default async function EditSessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; updated?: string }>;
}) {
  const { id } = await params;
  const { saved, updated } = await searchParams;
  const detail = await getLoggedSession(id);
  if (!detail) notFound();

  const { songs, skillGroups, recentSkills } = await getStudioData();
  const { session, songIds, skillIds } = detail;

  return (
    <div className="space-y-6">
      <Link
        href="/studio"
        className="inline-flex items-center gap-1.5 text-sm text-secondary transition hover:text-primary"
      >
        <span aria-hidden>&larr;</span> Back to Studio
      </Link>

      <div>
        <h1 className="font-display text-3xl tracking-tightish text-primary sm:text-4xl">
          Edit session
        </h1>
        <p className="mt-2 text-sm text-muted">{formatDate(session.date)}</p>
      </div>

      {saved === "1" ? (
        <p className="text-sm text-accent">Logged — you can tweak anything below.</p>
      ) : null}
      {updated === "1" ? (
        <p className="text-sm text-accent">Saved your changes.</p>
      ) : null}

      <Card className="space-y-4">
        <div>
          <p className="text-xs text-muted">Anchor</p>
          <p className="mt-1 text-sm text-secondary">
            {anchorSummary(session, songs, skillGroups, skillIds)}
          </p>
        </div>

        {session.intention ? (
          <div>
            <p className="text-xs text-muted">That day&apos;s intention</p>
            <p className="mt-1 leading-relaxed text-secondary">&ldquo;{session.intention}&rdquo;</p>
          </div>
        ) : null}

        <SessionReflectionForm
          sessionId={session.id}
          action={updateLoggedSession}
          session={session}
          songs={songs}
          skillGroups={skillGroups}
          recentSkills={recentSkills}
          songIds={songIds}
          skillIds={skillIds}
          submitLabel="Save changes"
        />
      </Card>

      <Card className="space-y-3">
        <h2 className="font-display text-lg text-primary">Session settings</h2>
        <p className="text-sm text-secondary">
          Remove this entry from your journal if it was logged by mistake.
        </p>
        <DeleteLoggedSessionButton sessionId={session.id} />
      </Card>
    </div>
  );
}
