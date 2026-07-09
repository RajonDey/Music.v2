"use client";

import { Button, Card } from "@music/ui";
import {
  RIYAZ_FEEL_GUITAR,
  RIYAZ_FEEL_VOCAL,
  type RiyazFeelGuitar,
  type RiyazFeelVocal,
  type Session,
} from "@music/types";
import { logRiyaz } from "@/app/(private)/studio/actions";
import { DiscardSessionButton } from "@/components/session/DiscardSessionButton";
import { resolveSessionAnchor } from "@/lib/session-utils";

const VOCAL_LABELS: Record<RiyazFeelVocal, string> = {
  good: "Good day",
  okay: "Okay",
  rough: "Rough",
};

const GUITAR_LABELS: Record<RiyazFeelGuitar, string> = {
  loose: "Loose",
  normal: "Normal",
  tight: "Tight",
};

export function RiyazEndSheet({
  session,
  onBackToStand,
}: {
  session: Session;
  onBackToStand?: () => void;
}) {
  const anchor = resolveSessionAnchor(session);
  const isVocal = anchor === "vocal";
  const chips = isVocal ? RIYAZ_FEEL_VOCAL : RIYAZ_FEEL_GUITAR;
  const labels = isVocal ? VOCAL_LABELS : GUITAR_LABELS;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl text-primary">Riyaz done</h2>
          <p className="mt-1 text-sm text-muted">
            {isVocal
              ? "Only if something about your voice stood out."
              : "Only if something about your hands stood out."}
          </p>
        </div>
        {onBackToStand ? (
          <button
            type="button"
            onClick={onBackToStand}
            className="text-sm text-secondary transition hover:text-primary"
          >
            ← Back to stand
          </button>
        ) : null}
      </div>

      <form action={logRiyaz.bind(null, session.id)} className="mt-6 space-y-5">
        <div>
          <p className="mb-2 text-xs text-muted" id="riyaz-feel-label">
            How did it feel? <span className="text-muted">(skip if fine)</span>
          </p>
          <div
            className="flex flex-wrap gap-2"
            role="radiogroup"
            aria-labelledby="riyaz-feel-label"
          >
            {chips.map((value) => (
              <label key={value} className="cursor-pointer">
                <input type="radio" name="riyaz_feel" value={value} className="peer sr-only" />
                <span className="inline-block rounded-full border border-border bg-elevated px-4 py-2 text-sm text-secondary transition duration-fast hover:border-border-strong peer-checked:border-accent peer-checked:bg-accent-soft peer-checked:text-primary">
                  {labels[value as keyof typeof labels]}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="submit" className="sm:flex-1">
            Done
          </Button>
          <DiscardSessionButton sessionId={session.id} />
        </div>
      </form>
    </Card>
  );
}
