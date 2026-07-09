"use client";

import { Button, Card, FieldLabel, SelectInput } from "@music/ui";
import type { RecentSkill } from "@/lib/practice";
import type { LastRiyaz } from "@/lib/practice";
import { startRiyaz } from "@/app/(private)/studio/actions";

export function RiyazEntry({
  lastRiyaz,
  vocalPickerSkills,
  pickerSkills,
}: {
  lastRiyaz: LastRiyaz | null;
  vocalPickerSkills: RecentSkill[];
  pickerSkills: RecentSkill[];
}) {
  const lastLabel = lastRiyaz
    ? lastRiyaz.anchor_type === "vocal"
      ? lastRiyaz.skill_name
        ? `Vocal · ${lastRiyaz.skill_name}`
        : "Vocal warm-up"
      : lastRiyaz.skill_name
        ? `Guitar · ${lastRiyaz.skill_name}`
        : "Guitar fingers"
    : null;

  return (
    <Card variant="elevated" className="space-y-5">
      <div>
        <h2 className="font-display text-xl text-primary">Morning riyaz</h2>
        <p className="mt-1 text-sm text-muted">
          Quick warm-up before the day. Voice or fingers. Light reflection only.
        </p>
      </div>

      {lastRiyaz ? (
        <form action={startRiyaz}>
          <input type="hidden" name="same_as_yesterday" value="1" />
          <Button
            type="submit"
            variant="soft"
            className="h-auto w-full justify-start gap-3 px-4 py-3 text-left font-normal"
          >
            <span className="text-accent" aria-hidden>
              ↻
            </span>
            <span>
              <span className="block font-display text-base text-primary">Same as yesterday</span>
              <span className="block text-xs text-muted">{lastLabel}</span>
            </span>
          </Button>
        </form>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <form action={startRiyaz} className="space-y-3">
          <input type="hidden" name="riyaz_anchor" value="vocal" />
          <Button type="submit" className="w-full">
            Vocal riyaz
          </Button>
          {vocalPickerSkills.length > 0 ? (
            <div>
              <FieldLabel htmlFor="riyaz-vocal-skill" hint="optional">
                Technique focus
              </FieldLabel>
              <SelectInput id="riyaz-vocal-skill" name="skill_id" defaultValue="">
                <option value="">Warm-up only</option>
                {vocalPickerSkills.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name}
                  </option>
                ))}
              </SelectInput>
            </div>
          ) : null}
        </form>

        <form action={startRiyaz} className="space-y-3">
          <input type="hidden" name="riyaz_anchor" value="guitar_skill" />
          <Button type="submit" variant="ghost" className="w-full border border-border">
            Guitar riyaz
          </Button>
          {pickerSkills.length > 0 ? (
            <div>
              <FieldLabel htmlFor="riyaz-guitar-skill" hint="optional">
                Finger drill
              </FieldLabel>
              <SelectInput id="riyaz-guitar-skill" name="skill_id" defaultValue="">
                <option value="">Open practice</option>
                {pickerSkills.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name}
                  </option>
                ))}
              </SelectInput>
            </div>
          ) : null}
        </form>
      </div>
    </Card>
  );
}
