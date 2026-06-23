"use client";

import { Button, FieldLabel, TextArea } from "@music/ui";
import type { MomentEntry } from "@/lib/skills";
import { deleteMoment, updateMoment } from "@/app/(private)/skills/actions";
import { ConfirmRemoveForm } from "@/components/ui/ConfirmRemoveForm";

export function MomentRow({
  moment,
  timeLabel,
}: {
  moment: MomentEntry;
  timeLabel: string;
}) {
  const preview = moment.note?.trim() || "No note";

  return (
    <li className="border-b border-border pb-2 text-sm last:border-0 last:pb-0">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-baseline justify-between gap-3 [&::-webkit-details-marker]:hidden">
          <span className="text-accent">{moment.skill_name ?? "Moment"}</span>
          <span className="shrink-0 text-xs text-muted">{timeLabel}</span>
        </summary>
        <div className="mt-2 space-y-3">
          <p className="leading-relaxed text-secondary">{preview}</p>
          <form action={updateMoment.bind(null, moment.id)} className="space-y-2">
            <FieldLabel htmlFor={`moment-edit-${moment.id}`}>Edit note</FieldLabel>
            <TextArea
              id={`moment-edit-${moment.id}`}
              name="note"
              rows={2}
              defaultValue={moment.note ?? ""}
              required
            />
            <Button type="submit" size="sm">
              Save
            </Button>
          </form>
          <ConfirmRemoveForm
            action={deleteMoment.bind(null, moment.id)}
            confirmMessage={`Remove this moment from your evidence log?\n\nThis cannot be undone.`}
          >
            Remove moment…
          </ConfirmRemoveForm>
        </div>
      </details>
    </li>
  );
}
