"use client";

import { Button } from "@music/ui";
import type { ReactNode } from "react";

type ConfirmRemoveFormProps = {
  action: () => void;
  confirmMessage: string;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
};

export function ConfirmRemoveForm({
  action,
  confirmMessage,
  children,
  className,
  "aria-label": ariaLabel,
}: ConfirmRemoveFormProps) {
  return (
    <form
      action={action}
      className={className}
      onSubmit={(e) => {
        if (!window.confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="text-secondary"
        aria-label={ariaLabel}
      >
        {children}
      </Button>
    </form>
  );
}
