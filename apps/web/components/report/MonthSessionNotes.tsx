import { Card } from "@music/ui";
import { qualityLabel } from "@music/types";
import type { MonthSessionNote } from "@/lib/report";

function formatDay(date: string): string {
  const d = new Date(`${date}T12:00:00`);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function MonthSessionNotes({ sessions }: { sessions: MonthSessionNote[] }) {
  if (sessions.length === 0) return null;

  const byDate = new Map<string, MonthSessionNote[]>();
  for (const session of sessions) {
    const list = byDate.get(session.date) ?? [];
    list.push(session);
    byDate.set(session.date, list);
  }

  return (
    <Card className="space-y-3">
      <div>
        <h2 className="font-display text-lg text-primary">Session notes this month</h2>
        <p className="mt-1 text-sm text-muted">What you logged — a quiet journal, not a score.</p>
      </div>
      <ul className="space-y-3">
        {[...byDate.entries()].map(([date, daySessions]) => {
          const primary = daySessions[0];
          const quality =
            primary.quality_rating != null
              ? qualityLabel(primary.quality_rating)
              : null;
          return (
            <li
              key={date}
              id={`session-${date}`}
              className="scroll-mt-24 border-b border-border pb-3 last:border-0 last:pb-0"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-medium text-primary">{formatDay(date)}</span>
                {quality ? (
                  <span className="text-xs text-accent">{quality}</span>
                ) : null}
              </div>
              {daySessions.map((session) => (
                <div key={session.id} className="mt-2 first:mt-1">
                  {session.intention ? (
                    <p className="text-sm italic text-secondary">
                      &ldquo;{session.intention}&rdquo;
                    </p>
                  ) : null}
                  {session.what_worked_on ? (
                    <p className="mt-1 text-sm leading-relaxed text-secondary">
                      {session.what_worked_on}
                    </p>
                  ) : null}
                  {session.what_felt_better ? (
                    <p className="mt-1 text-xs text-muted">
                      Felt better: {session.what_felt_better}
                    </p>
                  ) : null}
                </div>
              ))}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
