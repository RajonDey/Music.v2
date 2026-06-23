"use client";

import { useState } from "react";
import { Button, Card, FieldLabel, SelectInput, TextArea, TextInput } from "@music/ui";
import { PART_PRESETS } from "@music/types";
import type { SongPart } from "@music/types";
import { addPart, deletePart, movePartDown, movePartUp, updatePart } from "@/app/(private)/songs/actions";
import { ConfirmRemoveForm } from "@/components/ui/ConfirmRemoveForm";
import { ReorderButtons } from "@/components/songs/ReorderButtons";
import { ChordRow } from "./ChordRow";

function PartNameFields({
  idPrefix,
  defaultName = "",
}: {
  idPrefix: string;
  defaultName?: string;
}) {
  const presetMatch = PART_PRESETS.find(
    (p) => p !== "Custom" && p.toLowerCase() === defaultName.toLowerCase(),
  );
  const [preset, setPreset] = useState<string>(presetMatch ?? (defaultName ? "Custom" : "Verse"));
  const [customName, setCustomName] = useState(
    presetMatch || !defaultName ? "" : defaultName,
  );

  const resolvedName =
    preset === "Custom" ? customName.trim() : preset;

  return (
    <>
      <div>
        <FieldLabel htmlFor={`${idPrefix}-preset`}>Part</FieldLabel>
        <SelectInput
          id={`${idPrefix}-preset`}
          value={preset}
          onChange={(e) => setPreset(e.target.value)}
        >
          {PART_PRESETS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </SelectInput>
      </div>
      {preset === "Custom" ? (
        <div>
          <FieldLabel htmlFor={`${idPrefix}-custom`}>Custom name</FieldLabel>
          <TextInput
            id={`${idPrefix}-custom`}
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            required
            placeholder="Solo, Tag, …"
          />
        </div>
      ) : null}
      <input type="hidden" name="name" value={resolvedName} required />
    </>
  );
}

function PartEditor({
  part,
  songId,
  index,
  total,
}: {
  part: SongPart;
  songId: string;
  index: number;
  total: number;
}) {
  return (
    <details className="rounded-lg border border-border bg-elevated">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 [&::-webkit-details-marker]:hidden">
        <ReorderButtons
          songId={songId}
          itemId={part.id}
          index={index}
          total={total}
          moveUp={movePartUp}
          moveDown={movePartDown}
        />
        <span className="min-w-0 flex-1 font-display text-base text-primary">{part.name}</span>
        {part.chords ? (
          <span className="truncate font-mono text-xs text-accent">{part.chords}</span>
        ) : null}
      </summary>
      <div className="space-y-4 border-t border-border px-4 py-4">
        {part.chords ? <ChordRow chords={part.chords} /> : null}

        {part.notes ? (
          <p className="text-sm leading-relaxed text-secondary">{part.notes}</p>
        ) : null}

        <form action={updatePart.bind(null, part.id, songId)} className="space-y-4">
          <PartNameFields idPrefix={`part-${part.id}`} defaultName={part.name} />
          <div>
            <FieldLabel htmlFor={`part-chords-${part.id}`} hint="optional">
              Chords
            </FieldLabel>
            <TextInput
              id={`part-chords-${part.id}`}
              name="chords"
              defaultValue={part.chords ?? ""}
              placeholder="Am  F  C  G"
            />
          </div>
          <div>
            <FieldLabel htmlFor={`part-notes-${part.id}`} hint="optional">
              Notes
            </FieldLabel>
            <TextArea
              id={`part-notes-${part.id}`}
              name="notes"
              rows={2}
              defaultValue={part.notes ?? ""}
              placeholder="Capo 2, softer strum here…"
            />
          </div>
          <Button type="submit" size="sm">
            Save
          </Button>
        </form>

        <div className="border-t border-border pt-4">
          <ConfirmRemoveForm
            action={deletePart.bind(null, part.id, songId)}
            confirmMessage={`Remove "${part.name}" from this song's parts map?\n\nThis cannot be undone.`}
          >
            Remove part…
          </ConfirmRemoveForm>
        </div>
      </div>
    </details>
  );
}

export function PartsMap({
  songId,
  parts,
}: {
  songId: string;
  parts: SongPart[];
}) {
  return (
    <Card className="space-y-4">
      <div>
        <h2 className="font-display text-lg text-primary">Parts map</h2>
        <p className="mt-1 text-sm text-muted">
          Lay out the song&apos;s shape — verse, chorus, the tricky bridge.
        </p>
      </div>

      {parts.length > 0 ? (
        <div className="space-y-2">
          {parts.map((part, index) => (
            <PartEditor
              key={part.id}
              part={part}
              songId={songId}
              index={index}
              total={parts.length}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-secondary">
          No parts yet. Start with the part you&apos;re working on most.
        </p>
      )}

      <details>
        <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-sm text-accent transition hover:text-accent-strong [&::-webkit-details-marker]:hidden">
          <span aria-hidden>+</span> Add a part
        </summary>
        <form
          action={addPart.bind(null, songId)}
          className="mt-3 space-y-4 rounded-lg border border-border bg-elevated p-4"
        >
          <PartNameFields idPrefix="new-part" />
          <div>
            <FieldLabel htmlFor="new-part-chords" hint="optional">
              Chords
            </FieldLabel>
            <TextInput id="new-part-chords" name="chords" placeholder="G  D  Am  C" />
          </div>
          <div>
            <FieldLabel htmlFor="new-part-notes" hint="optional">
              Notes
            </FieldLabel>
            <TextArea id="new-part-notes" name="notes" rows={2} />
          </div>
          <Button type="submit" size="sm">
            Add part
          </Button>
        </form>
      </details>
    </Card>
  );
}
