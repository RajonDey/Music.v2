"use client";

import { ConfirmRemoveForm } from "@/components/ui/ConfirmRemoveForm";
import { letDriftPocketGo } from "@/app/(private)/songs/drift-actions";

export function DeleteDriftPocketButton({
  listId,
  listName,
}: {
  listId: string;
  listName: string;
}) {
  return (
    <ConfirmRemoveForm
      action={letDriftPocketGo.bind(null, listId)}
      confirmMessage={`Let the “${listName}” category go?\n\nListening lines in it will go. Notebooks stay — they just won’t wear this heading anymore.`}
      aria-label={`Let the ${listName} list go`}
    >
      Let this list go
    </ConfirmRemoveForm>
  );
}
