import { Button, Card, FieldLabel, TextArea } from "@music/ui";
import { VOICE_DAYS, type VocalLog, type VoiceDay } from "@music/types";
import { logVocal } from "@/app/(private)/vocal/actions";
import { ConfidenceTrend } from "./ConfidenceTrend";

const VOICE_DAY_LABEL: Record<VoiceDay, string> = {
  good: "Good day",
  okay: "Okay",
  rough: "Rough",
};

export function ConfidenceLog({ logs }: { logs: VocalLog[] }) {
  const recent = logs.slice(0, 8);
  const trendValues = logs
    .filter((l) => l.confidence !== null)
    .slice()
    .reverse()
    .map((l) => l.confidence as number);

  return (
    <Card className="space-y-4">
      <h2 className="font-display text-lg text-primary">How did singing feel?</h2>

      {trendValues.length >= 2 ? (
        <div className="space-y-1">
          <ConfidenceTrend values={trendValues} />
          <p className="text-xs text-muted">The shape over time — not a score to chase.</p>
        </div>
      ) : null}

      <form action={logVocal} className="space-y-5">
        <div>
          <FieldLabel hint="1 = shaky · 5 = solid">Confidence</FieldLabel>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Confidence">
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n} className="cursor-pointer">
                <input type="radio" name="confidence" value={n} className="peer sr-only" />
                <span className="inline-block h-10 w-10 rounded-full border border-border bg-elevated text-center leading-9 text-secondary transition duration-fast hover:border-border-strong peer-checked:border-accent peer-checked:bg-accent-soft peer-checked:text-primary peer-checked:shadow-sm">
                  {n}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <FieldLabel>Voice day</FieldLabel>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Voice day">
            {VOICE_DAYS.map((day) => (
              <label key={day} className="cursor-pointer">
                <input type="radio" name="voice_day" value={day} className="peer sr-only" />
                <span className="inline-block rounded-full border border-border bg-elevated px-4 py-2 text-sm text-secondary transition duration-fast hover:border-border-strong peer-checked:border-accent peer-checked:bg-accent-soft peer-checked:text-primary">
                  {VOICE_DAY_LABEL[day]}
                </span>
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted">
            Some days the voice just shows up differently. Naming it takes the
            pressure off.
          </p>
        </div>

        <div>
          <FieldLabel htmlFor="vocal-note" hint="optional">
            Anything to remember?
          </FieldLabel>
          <TextArea
            id="vocal-note"
            name="note"
            rows={2}
            placeholder="Head voice felt easier after the lip trills."
          />
        </div>

        <Button type="submit">Save how it felt</Button>
      </form>
      <p className="text-xs text-muted">
        If a Studio session is open today, this links to it quietly in the background.
      </p>

      {recent.length > 0 ? (
        <div className="border-t border-border pt-3">
          <p className="mb-2 text-xs text-muted">Recent</p>
          <ul className="space-y-2">
            {recent.map((log) => (
              <li
                key={log.id}
                className="border-b border-border pb-2 text-sm last:border-0 last:pb-0"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-secondary">
                    {log.confidence !== null ? (
                      <span className="text-accent">{log.confidence}/5</span>
                    ) : null}
                    {log.voice_day ? (
                      <span className="ml-2 text-muted">
                        {VOICE_DAY_LABEL[log.voice_day]}
                      </span>
                    ) : null}
                  </span>
                  <span className="shrink-0 text-xs text-muted">
                    {new Date(log.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {log.note ? (
                  <p className="mt-0.5 leading-relaxed text-secondary">{log.note}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Card>
  );
}
