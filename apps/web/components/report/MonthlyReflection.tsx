import { Button, Card, TextArea } from "@music/ui";
import type { MonthlyReflection as MonthlyReflectionType } from "@music/types";
import { saveReflection } from "@/app/(private)/report/actions";

function formatMonthLabel(label: string): string {
  const [y, m] = label.split("-").map(Number);
  if (!y || !m) return label;
  return new Date(y, m - 1, 1).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}

export function MonthlyReflection({
  current,
  history,
  monthLabel,
  monthTitle,
}: {
  current: MonthlyReflectionType | null;
  history: MonthlyReflectionType[];
  monthLabel: string;
  monthTitle: string;
}) {
  const past = history.filter(
    (r) => r.month_label !== monthLabel && r.reflection,
  );

  return (
    <Card className="space-y-4">
      <h2 className="font-display text-lg text-primary">Looking back on {monthTitle}</h2>
      <form action={saveReflection} className="space-y-3">
        <TextArea
          name="reflection"
          rows={4}
          defaultValue={current?.reflection ?? ""}
          placeholder="What did this month of playing feel like? What surprised you, what are you glad you stuck with?"
        />
        <Button type="submit">Save reflection</Button>
      </form>

      {past.length > 0 ? (
        <div className="space-y-3 border-t border-border pt-4">
          <p className="text-xs text-muted">Earlier months</p>
          {past.map((r) => (
            <div key={r.id}>
              <p className="text-sm text-accent">{formatMonthLabel(r.month_label)}</p>
              <p className="mt-0.5 whitespace-pre-line leading-relaxed text-secondary">
                {r.reflection}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </Card>
  );
}
