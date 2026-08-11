"use client";

import { ConfirmRemoveForm } from "@/components/ui/ConfirmRemoveForm";
import { letDriftGo } from "@/app/(private)/songs/drift-actions";

export function LetDriftGoButton({
  itemId,
  label,
}: {
  itemId: string;
  label: string;
}) {
  return (
    <ConfirmRemoveForm
      action={letDriftGo.bind(null, itemId)}
      confirmMessage={`Let “${label}” go from this list?`}
      aria-label={`Let ${label} go`}
    >
      Let it go
    </ConfirmRemoveForm>
  );
}
