import type { VocalStandPayload } from "@/lib/stand";

function formatDuration(seconds: number | null): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s === 0 ? `${m} min` : `${m}:${s.toString().padStart(2, "0")}`;
}

export function VocalStand({ payload }: { payload: VocalStandPayload }) {
  const { warmups, exercises } = payload;
  const total = warmups.reduce((sum, w) => sum + (w.duration_seconds ?? 0), 0);

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="font-display text-2xl tracking-tightish text-primary sm:text-3xl">
          Vocal warm-up
        </h1>
        <p className="text-sm text-secondary">Gentle on-ramp — tap each step as you go.</p>
      </header>

      {warmups.length > 0 ? (
        <section className="space-y-2">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-lg text-primary">Routine</h2>
            {total > 0 ? (
              <span className="text-xs text-muted">~{Math.round(total / 60)} min</span>
            ) : null}
          </div>
          <ul className="space-y-1.5">
            {warmups.map((w) => (
              <li key={w.id}>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-elevated px-3.5 py-3 transition hover:border-border-strong">
                  <input type="checkbox" className="peer sr-only" />
                  <span
                    aria-hidden
                    className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-border text-[0.65rem] transition peer-checked:border-accent peer-checked:bg-accent"
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
        </section>
      ) : null}

      {exercises.length > 0 ? (
        <section className="space-y-2">
          <h2 className="font-display text-lg text-primary">Exercises</h2>
          <ul className="space-y-2">
            {exercises.map((ex) => (
              <li key={ex.id}>
                <a
                  href={ex.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col gap-0.5 rounded-lg border border-border bg-elevated px-3.5 py-3 transition hover:border-border-strong"
                >
                  <span className="text-sm text-primary">{ex.label}</span>
                  {ex.problem_tag ? (
                    <span className="text-xs text-muted">{ex.problem_tag}</span>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
