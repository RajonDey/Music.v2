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
import type { RecentSkill, SkillGroup } from "@/lib/practice";
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
  pickerSkills,
  skillGroups,
  vocalPickerSkills,
  vocalSkillGroups,
}: {
  songs: Song[];
  pickerSkills: RecentSkill[];
  skillGroups: SkillGroup[];
  vocalPickerSkills: RecentSkill[];
  vocalSkillGroups: SkillGroup[];
}) {
  const [anchor, setAnchor] = useState<SessionAnchorType>("song");
  const [skillId, setSkillId] = useState("");
  const [vocalSkillId, setVocalSkillId] = useState("");
  const activeSongs = songs.filter((s) => s.learning_stage !== "complete");

  return (
    <Card variant="elevated">
      <h2 className="font-display text-xl text-primary">What are you sitting for?</h2>
      <p className="mt-1 text-sm text-muted">Pick one anchor. The stand opens when you start.</p>

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
                    {song.artist ? ` · ${song.artist}` : ""}
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
          <div className="space-y-3">
            <input type="hidden" name="skill_id" value={skillId} />
            <FieldLabel>Which skill?</FieldLabel>
            {pickerSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {pickerSkills.map((skill) => (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => setSkillId(skill.id)}
                    className={`rounded-full border px-3.5 py-1.5 text-sm transition duration-fast ${
                      skillId === skill.id
                        ? "border-accent bg-accent-soft text-primary"
                        : "border-border bg-elevated text-secondary hover:border-border-strong"
                    }`}
                  >
                    {skill.name}
                  </button>
                ))}
              </div>
            ) : null}
            <div>
              <FieldLabel htmlFor="anchor-skill" hint={pickerSkills.length > 0 ? "or pick any" : undefined}>
                {pickerSkills.length > 0 ? "Full catalogue" : "Pick a skill"}
              </FieldLabel>
              <SelectInput
                id="anchor-skill"
                value={skillId}
                onChange={(e) => setSkillId(e.target.value)}
                required
              >
                <option value="" disabled>
                  Pick a skill…
                </option>
                {skillGroups.map((group) => (
                  <optgroup key={group.category} label={group.category}>
                    {group.skills.map((skill) => (
                      <option key={skill.id} value={skill.id}>
                        {skill.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </SelectInput>
            </div>
            <p className="text-xs text-muted">
              Skills with saved notes or links appear as quick picks.{" "}
              <Link href="/skills" className="text-accent hover:text-accent-strong">
                Open Skills Lab
              </Link>{" "}
              to curate material.
            </p>
          </div>
        ) : null}

        {anchor === "vocal" ? (
          <div className="space-y-3">
            <input type="hidden" name="skill_id" value={vocalSkillId} />
            <p className="text-sm text-secondary">
              Your warm-up routine is always on the stand. Optionally pick a technique to
              focus on.
            </p>
            {vocalPickerSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {vocalPickerSkills.map((skill) => (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() =>
                      setVocalSkillId((current) => (current === skill.id ? "" : skill.id))
                    }
                    className={`rounded-full border px-3.5 py-1.5 text-sm transition duration-fast ${
                      vocalSkillId === skill.id
                        ? "border-accent bg-accent-soft text-primary"
                        : "border-border bg-elevated text-secondary hover:border-border-strong"
                    }`}
                  >
                    {skill.name}
                  </button>
                ))}
              </div>
            ) : null}
            {vocalSkillGroups.length > 0 ? (
              <div>
                <FieldLabel
                  htmlFor="anchor-vocal-skill"
                  hint={vocalPickerSkills.length > 0 ? "optional" : undefined}
                >
                  {vocalPickerSkills.length > 0 ? "Or pick from catalogue" : "Focus technique"}
                </FieldLabel>
                <SelectInput
                  id="anchor-vocal-skill"
                  value={vocalSkillId}
                  onChange={(e) => setVocalSkillId(e.target.value)}
                >
                  <option value="">Warm-up only</option>
                  {vocalSkillGroups.map((group) => (
                    <optgroup key={group.category} label={group.category}>
                      {group.skills.map((skill) => (
                        <option key={skill.id} value={skill.id}>
                          {skill.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </SelectInput>
              </div>
            ) : null}
            <p className="text-xs text-muted">
              Skills with saved notes or links appear as quick picks.{" "}
              <Link href="/skills?tab=vocal" className="text-accent hover:text-accent-strong">
                Open Vocal Skills Lab
              </Link>{" "}
              to curate material.
            </p>
          </div>
        ) : null}

        {anchor === "freestyle" ? (
          <p className="text-sm text-secondary">
            Metronome and an optional intention. That&apos;s all.
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
                  : anchor === "vocal"
                    ? "Mixed voice on the chorus…"
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
