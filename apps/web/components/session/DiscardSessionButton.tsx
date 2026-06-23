"use client";

import { Button } from "@music/ui";
import { discardSession } from "@/app/(private)/studio/actions";

const CONFIRM_MESSAGE =
  "Discard this in-progress session?\n\nAnything you wrote in the reflection won't be saved. This cannot be undone.";

export function DiscardSessionButton({ sessionId }: { sessionId: string }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="text-secondary"
      onClick={() => {
        if (window.confirm(CONFIRM_MESSAGE)) {
          void discardSession(sessionId);
        }
      }}
    >
      Discard session…
    </Button>
  );
}
