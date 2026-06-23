"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Button,
  Card,
  FieldLabel,
  SelectInput,
  TextInput,
} from "@music/ui";
import {
  FEELING_BEFORE,
  SONG_FOCUS,
  type SessionAnchorType,
  type Song,
  type SongFocus,
} from "@music/types";
import type { RecentSkill } from "@/lib/practice";
import { startSession } from "@/app/(private)/studio/actions";

const ANCHOR_OPTIONS: { value: SessionAnchorType; label: string; hint: string }[] = [
  { value: "song", label: "Song", hint: "Work on a piece" },
  { value: "guitar_skill", label: "Guitar", hint: "Craft / technique" },
  { value: "vocal", label: "Vocal", hint: "Warm-up & voice" },
  { value: "freestyle", label: "Freestyle", hint: "Just play" },
];

const focusLabels: Record<SongFocus, string> = {
  guitar: "Guitar",
  vocal: "Vocal",
  both: "Both",
};

function feelingLabel(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function AnchorPicker({
  songs,
  recentSkills,
}: {
  songs: Song[];
  recentSkills: RecentSkill[];
}) {
  const [anchor, setAnchor] = useState<SessionAnchorType>("song");
  const activeSongs = songs.filter((s) => s.learning_stage !== "complete");

  return (
    <Card variant="elevated">
      <h2 className="font-display text-xl text-primary">What are you sitting for?</h2>
      <p className="mt-1 text-sm text-muted">One anchor — then the stand opens when you start.</p>

      <form action={startSession} className="mt-6 space-y-5">
        <input type="hidden" name="anchor_type" value={anchor} />

        <div>
          <FieldLabel>Today&apos;s anchor</FieldLabel>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup">
            {ANCHOR_OPTIONS.map((option) => (
              <label key={option.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="anchor_picker"
                  value={option.value}
                  checked={anchor === option.value}
                  onChange={() => setAnchor(option.value)}
                  className="peer sr-only"
                />
                <span className="flex flex-col rounded-lg border border-border bg-elevated px-3 py-2.5 transition duration-fast hover:border-border-strong peer-checked:border-accent peer-checked:bg-accent-soft">
                  <span className="text-sm font-medium text-primary">{option.label}</span>
                  <span className="text-xs text-muted">{option.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        {anchor === "song" ? (
          <>
            <div>
              <FieldLabel htmlFor="anchor-song">Which song?</FieldLabel>
              <SelectInput id="anchor-song" name="song_id" defaultValue="" required>
                <option value="" disabled>
                  Pick a song…
                </option>
                {activeSongs.map((song) => (
                  <option key={song.id} value={song.id}>
                    {song.name}
                    {song.artist ? ` — ${song.artist}` : ""}
                  </option>
                ))}
              </SelectInput>
            </div>

            <div>
              <FieldLabel hint="optional">Focus today</FieldLabel>
              <p className="mb-2 text-xs text-muted">
                Leave blank to infer from where the song is in your pipeline.
              </p>
              <div className="flex flex-wrap gap-2" role="radiogroup">
                <label className="cursor-pointer">
                  <input type="radio" name="song_focus" value="" defaultChecked className="peer sr-only" />
                  <span className="inline-block rounded-full border border-border bg-elevated px-4 py-2 text-sm text-secondary transition peer-checked:border-accent peer-checked:bg-accent-soft peer-checked:text-primary">
                    Auto
                  </span>
                </label>
                {SONG_FOCUS.map((focus) => (
                  <label key={focus} className="cursor-pointer">
                    <input
                      type="radio"
                      name="song_focus"
                      value={focus}
                      className="peer sr-only"
                    />
                    <span className="inline-block rounded-full border border-border bg-elevated px-4 py-2 text-sm text-secondary transition peer-checked:border-accent peer-checked:bg-accent-soft peer-checked:text-primary">
                      {focusLabels[focus]}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </>
        ) : null}

        {anchor === "guitar_skill" ? (
          <div>
            <FieldLabel>Which skill?</FieldLabel>
            {recentSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2" role="radiogroup">
                {recentSkills.map((skill) => (
                  <label key={skill.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="skill_id"
                      value={skill.id}
                      required
                      className="peer sr-only"
                    />
                    <span className="inline-block rounded-full border border-border bg-elevated px-3.5 py-1.5 text-sm text-secondary transition peer-checked:border-accent peer-checked:bg-accent-soft peer-checked:text-primary">
                      {skill.name}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-secondary">
                No recent skills yet — pick one from{" "}
                <Link href="/skills" className="text-accent hover:text-accent-strong">
                  Skills Lab
                </Link>
                .
              </p>
            )}
            {recentSkills.length > 0 ? (
              <p className="mt-2 text-xs text-muted">
                More in{" "}
                <Link href="/skills" className="text-accent hover:text-accent-strong">
                  Skills Lab
                </Link>
              </p>
            ) : null}
          </div>
        ) : null}

        {anchor === "vocal" ? (
          <p className="text-sm text-secondary">
            Your warm-up routine and exercises will be on the stand — no extra setup.
          </p>
        ) : null}

        {anchor === "freestyle" ? (
          <p className="text-sm text-secondary">
            Metronome and an optional intention — nothing else required.
          </p>
        ) : null}

        <div>
          <FieldLabel htmlFor="anchor-intention" hint="optional">
            One-line focus
          </FieldLabel>
          <TextInput
            id="anchor-intention"
            name="intention"
            placeholder={
              anchor === "song"
                ? "Just the chorus transition…"
                : anchor === "guitar_skill"
                  ? "Clean barre changes…"
                  : "Whatever comes to mind…"
            }
          />
        </div>

        <div>
          <FieldLabel hint="optional">How are you feeling?</FieldLabel>
          <div className="flex flex-wrap gap-2" role="radiogroup">
            {FEELING_BEFORE.map((feeling) => (
              <label key={feeling} className="cursor-pointer">
                <input
                  type="radio"
                  name="feeling_before"
                  value={feeling}
                  className="peer sr-only"
                />
                <span className="inline-block rounded-full border border-border bg-elevated px-4 py-2 text-sm text-secondary transition duration-fast hover:border-border-strong peer-checked:border-accent peer-checked:bg-accent-soft peer-checked:text-primary peer-checked:shadow-sm">
                  {feelingLabel(feeling)}
                </span>
              </label>
            ))}
          </div>
        </div>

        <Button type="submit">Start session</Button>
      </form>
    </Card>
  );
}
