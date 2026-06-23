import type { FreestyleStandPayload } from "@/lib/stand";

export function FreestyleStand({ payload }: { payload: FreestyleStandPayload }) {
  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="font-display text-2xl tracking-tightish text-primary sm:text-3xl">
          Freestyle
        </h1>
        <p className="text-sm text-secondary">No song picked — just play and see what comes.</p>
      </header>

      {payload.intention ? (
        <blockquote className="border-l-2 border-accent/40 pl-4 text-base italic leading-relaxed text-secondary">
          &ldquo;{payload.intention}&rdquo;
        </blockquote>
      ) : null}
    </div>
  );
}
