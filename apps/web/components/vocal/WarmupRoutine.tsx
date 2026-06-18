import { Card } from "@music/ui";
import type { VocalWarmup } from "@music/types";

function formatDuration(seconds: number | null): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s === 0 ? `${m} min` : `${m}:${s.toString().padStart(2, "0")}`;
}

export function WarmupRoutine({ warmups }: { warmups: VocalWarmup[] }) {
  if (warmups.length === 0) return null;

  const total = warmups.reduce((sum, w) => sum + (w.duration_seconds ?? 0), 0);

  return (
    <Card className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-lg text-primary">Warm-up routine</h2>
        {total > 0 ? (
          <span className="text-xs text-muted">~{Math.round(total / 60)} min</span>
        ) : null}
      </div>
      <p className="text-sm text-muted">
        A gentle on-ramp. Tap each as you go — it resets each time, no streak to keep.
      </p>
      <ul className="space-y-1.5">
        {warmups.map((w) => (
          <li key={w.id}>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-elevated px-3.5 py-3 transition hover:border-border-strong">
              <input type="checkbox" className="peer sr-only" />
              <span
                aria-hidden
                className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-border text-[0.65rem] text-base transition peer-checked:border-accent peer-checked:bg-accent"
              >
                {"\u2713"}
              </span>
              <span className="flex-1 text-sm text-secondary transition peer-checked:text-muted peer-checked:line-through">
                {w.name}
              </span>
              {w.duration_seconds ? (
                <span className="shrink-0 text-xs text-muted">
                  {formatDuration(w.duration_seconds)}
                </span>
              ) : null}
            </label>
          </li>
        ))}
      </ul>
    </Card>
  );
}
