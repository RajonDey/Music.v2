import { Card } from "@music/ui";
import type { YearMonth } from "@/lib/report";

export function YearView({
  months,
  year,
  currentMonth,
}: {
  months: YearMonth[];
  year: number;
  currentMonth: number;
}) {
  const max = Math.max(1, ...months.map((m) => m.count));

  return (
    <Card className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-lg text-primary">The year so far</h2>
        <span className="text-xs text-muted">{year}</span>
      </div>
      <div className="flex items-end justify-between gap-1.5" style={{ height: 96 }}>
        {months.map((m) => {
          const h = m.count === 0 ? 3 : Math.round((m.count / max) * 80) + 6;
          const isCurrent = m.month === currentMonth;
          return (
            <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[0.6rem] text-muted">{m.count || ""}</span>
              <div
                className={`w-full rounded-t ${
                  isCurrent ? "bg-accent" : m.count > 0 ? "bg-accent/40" : "bg-elevated"
                }`}
                style={{ height: h }}
                aria-label={`${m.label}: ${m.count} sessions`}
              />
              <span
                className={`text-[0.6rem] ${isCurrent ? "text-secondary" : "text-muted"}`}
              >
                {m.label}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
