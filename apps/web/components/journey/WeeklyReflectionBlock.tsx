"use client";

import { useState } from "react";
import { Button, Card, FieldLabel, TextArea } from "@music/ui";

export function WeeklyReflectionBlock() {
  const [tinyWin, setTinyWin] = useState("");
  const [saved, setSaved] = useState(false);
  const [nudge, setNudge] = useState(false);

  function save() {
    if (!tinyWin.trim()) {
      setNudge(true);
      setSaved(false);
      return;
    }
    setNudge(false);
    setSaved(true);
  }

  return (
    <Card>
      <h2 className="font-display text-xl text-primary">Weekly reflection</h2>
      <p className="mt-1 text-sm text-muted">Sunday journal — prose, not scores.</p>

      <div className="mt-6 space-y-5">
        <div>
          <FieldLabel htmlFor="reflect-hard" hint="optional">
            What felt hard?
          </FieldLabel>
          <TextArea id="reflect-hard" rows={2} placeholder="Be honest — it helps." />
        </div>
        <div>
          <FieldLabel htmlFor="reflect-good" hint="optional">
            What felt good?
          </FieldLabel>
          <TextArea id="reflect-good" rows={2} placeholder="Anything that landed…" />
        </div>
        <div>
          <FieldLabel htmlFor="reflect-win">One tiny win</FieldLabel>
          <TextArea
            id="reflect-win"
            rows={2}
            value={tinyWin}
            onChange={(e) => {
              setTinyWin(e.target.value);
              if (e.target.value.trim()) setNudge(false);
            }}
            placeholder="Even showing up counts."
          />
          {nudge ? (
            <p className="mt-2 text-sm text-accent">
              Just one small thing — even &ldquo;I sat down with the guitar&rdquo;
              counts.
            </p>
          ) : null}
        </div>
        <div>
          <FieldLabel htmlFor="reflect-different" hint="optional">
            Would you do anything differently?
          </FieldLabel>
          <TextArea
            id="reflect-different"
            rows={2}
            placeholder="Skip if nothing comes to mind."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" onClick={save}>
            Save reflection
          </Button>
          {saved ? (
            <span className="animate-fade text-sm text-accent">
              Held onto — that&apos;s your week.
            </span>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
