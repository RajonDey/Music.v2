"use client";

import { useState } from "react";
import { Button, Card, Chip, FieldLabel, TextArea } from "@music/ui";
import { QUALITY_LABELS } from "@music/types";

export function ReflectionBlock() {
  const [quality, setQuality] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  return (
    <Card>
      <h2 className="font-display text-xl text-primary">After practice</h2>
      <p className="mt-1 text-sm text-muted">What shifted today?</p>

      <div className="mt-6 space-y-5">
        <div>
          <FieldLabel htmlFor="reflection-worked">
            What did you actually work on?
          </FieldLabel>
          <TextArea
            id="reflection-worked"
            rows={3}
            placeholder="Ran the verse twice, tried a softer strum…"
          />
        </div>

        <div>
          <FieldLabel htmlFor="reflection-better">
            What&apos;s one thing that felt better?
          </FieldLabel>
          <TextArea
            id="reflection-better"
            rows={2}
            placeholder="The G chord change felt less rushed."
          />
        </div>

        <div>
          <FieldLabel htmlFor="reflection-stuck" hint="optional">
            Did anything feel stuck?
          </FieldLabel>
          <TextArea
            id="reflection-stuck"
            rows={2}
            placeholder="Skip if nothing comes to mind."
          />
        </div>

        <div>
          <FieldLabel>How did the session feel?</FieldLabel>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Session quality"
          >
            {QUALITY_LABELS.map((label) => (
              <Chip
                key={label}
                selected={quality === label}
                onClick={() => setQuality(quality === label ? null : label)}
              >
                {label}
              </Chip>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" onClick={() => setSaved(true)}>
            Log session
          </Button>
          {saved ? (
            <span className="animate-fade text-sm text-accent">
              Saved — nice showing up.
            </span>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
