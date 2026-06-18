import Link from "next/link";
import { Card } from "@music/ui";
import type { CalendarCell } from "@/lib/report";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function PracticeCalendar({
  cells,
  monthTitle,
  monthPrefix,
}: {
  cells: CalendarCell[];
  monthTitle: string;
  monthPrefix: string;
}) {
  const activeCount = cells.filter((c) => c.active).length;

  return (
    <Card className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-lg text-primary">Practice calendar</h2>
        <span className="text-xs text-muted">{monthTitle}</span>
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-center">
        {WEEKDAYS.map((d, i) => (
          <span key={i} className="text-[0.65rem] text-muted">
            {d}
          </span>
        ))}
        {cells.map((cell, i) => {
          if (cell.day === null) {
            return <div key={i} />;
          }

          const dateIso = `${monthPrefix}-${String(cell.day).padStart(2, "0")}`;

          if (cell.active) {
            return (
              <Link
                key={i}
                href={`#session-${dateIso}`}
                className="grid aspect-square place-items-center rounded-lg bg-accent-soft text-xs font-medium text-primary ring-1 ring-accent/40 transition hover:ring-accent"
                aria-label={`Session on ${dateIso}`}
              >
                {cell.day}
              </Link>
            );
          }

          return (
            <div key={i} className="grid aspect-square place-items-center text-xs text-muted">
              {cell.day}
            </div>
          );
        })}
      </div>
      {activeCount > 0 ? (
        <p className="text-xs text-muted">
          {activeCount} day{activeCount === 1 ? "" : "s"} at the instrument this month.
          Tap a highlighted day to read your notes below.
        </p>
      ) : (
        <p className="text-xs text-muted">
          No sessions logged yet this month — whenever you sit down, it&apos;ll show here.
        </p>
      )}
    </Card>
  );
}
