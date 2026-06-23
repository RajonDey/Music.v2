"use client";

import { ConfirmRemoveForm } from "@/components/ui/ConfirmRemoveForm";
import { deleteLoggedSession } from "@/app/(private)/studio/actions";

export function DeleteLoggedSessionButton({ sessionId }: { sessionId: string }) {
  return (
    <ConfirmRemoveForm
      action={deleteLoggedSession.bind(null, sessionId)}
      confirmMessage={`Remove this logged session from your journal?\n\nThis cannot be undone.`}
    >
      Remove session…
    </ConfirmRemoveForm>
  );
}
