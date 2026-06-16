"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Chip,
  FieldLabel,
  SelectInput,
  TextInput,
} from "@music/ui";
import { FEELING_BEFORE } from "@music/types";

const songs = ["Knockin' on Heaven's Door — Bob Dylan", "Freestyle"];

const feelings = FEELING_BEFORE.map((f) => ({
  value: f,
  label: f.charAt(0).toUpperCase() + f.slice(1),
}));

export function IntentionBlock() {
  const [feeling, setFeeling] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  return (
    <Card variant="elevated">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-primary">Before practice</h2>
        {started ? (
          <Badge className="bg-stage-discovering/15 text-stage-discovering">
            Session started
          </Badge>
        ) : null}
      </div>
      <p className="mt-1 text-sm text-muted">Set a gentle intention — no pressure.</p>

      <div className="mt-6 space-y-5">
        <div>
          <FieldLabel htmlFor="intention-song">What are you playing today?</FieldLabel>
          <SelectInput id="intention-song" defaultValue={songs[0]}>
            {songs.map((song) => (
              <option key={song}>{song}</option>
            ))}
          </SelectInput>
        </div>

        <div>
          <FieldLabel htmlFor="intention-focus" hint="optional">
            What&apos;s your one focus?
          </FieldLabel>
          <TextInput
            id="intention-focus"
            placeholder="Just the chorus transition…"
          />
        </div>

        <div>
          <FieldLabel>How are you feeling about it?</FieldLabel>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Feeling before practice"
          >
            {feelings.map((f) => (
              <Chip
                key={f.value}
                selected={feeling === f.value}
                onClick={() => setFeeling(feeling === f.value ? null : f.value)}
              >
                {f.label}
              </Chip>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" onClick={() => setStarted(true)}>
            {started ? "Session in progress" : "Start session"}
          </Button>
          {started ? (
            <span className="text-sm text-secondary">Enjoy it — no clock running.</span>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
