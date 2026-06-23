import Link from "next/link";
import { Card } from "@music/ui";
import type { RecentLoggedSession } from "@/lib/practice";

function formatDate(value: string): string {
  const d = new Date(`${value}T12:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function RecentSessionsCard({ sessions }: { sessions: RecentLoggedSession[] }) {
  if (sessions.length === 0) return null;

  return (
    <Card className="space-y-3">
      <div>
        <h2 className="font-display text-lg text-primary">Recent sessions</h2>
        <p className="mt-1 text-sm text-muted">
          Jump back to fix a typo or add what you forgot.
        </p>
      </div>
      <ul className="space-y-2">
        {sessions.map((session) => (
          <li
            key={session.id}
            className="flex items-start justify-between gap-3 border-b border-border pb-2 text-sm last:border-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="text-muted">{formatDate(session.date)}</p>
              {session.what_worked_on ? (
                <p className="mt-0.5 line-clamp-2 leading-relaxed text-secondary">
                  {session.what_worked_on}
                </p>
              ) : session.intention ? (
                <p className="mt-0.5 line-clamp-2 italic leading-relaxed text-secondary">
                  &ldquo;{session.intention}&rdquo;
                </p>
              ) : (
                <p className="mt-0.5 text-secondary">Session logged</p>
              )}
            </div>
            <Link
              href={`/studio/session/${session.id}`}
              className="shrink-0 text-xs text-secondary transition hover:text-primary"
            >
              Edit
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
