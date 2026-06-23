"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "@music/ui";
import type { StandPayload } from "@/lib/stand";
import { Metronome } from "@/components/tools/Metronome";
import { DiscardSessionButton } from "@/components/session/DiscardSessionButton";
import { FreestyleStand } from "@/components/session/stands/FreestyleStand";
import { SkillStand } from "@/components/session/stands/SkillStand";
import { SongStand } from "@/components/session/stands/SongStand";
import { VocalStand } from "@/components/session/stands/VocalStand";

function StandBody({ payload }: { payload: StandPayload }) {
  switch (payload.kind) {
    case "song":
      return <SongStand payload={payload} />;
    case "guitar_skill":
      return <SkillStand payload={payload} />;
    case "vocal":
      return <VocalStand payload={payload} />;
    case "freestyle":
      return <FreestyleStand payload={payload} />;
  }
}

export function SessionStandShell({
  sessionId,
  payload,
  onEndSession,
  footer,
}: {
  sessionId: string;
  payload: StandPayload;
  onEndSession: () => void;
  footer?: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const defaultBpm = payload.kind === "song" ? payload.song.bpm : null;

  useEffect(() => {
    setMounted(true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const shell = (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-base"
      role="dialog"
      aria-modal="true"
      aria-label="Practice stand"
    >
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-base px-4 py-3 sm:px-6">
        <Button type="button" size="sm" onClick={onEndSession}>
          End session
        </Button>
        <details className="relative">
          <summary className="cursor-pointer list-none rounded-lg border border-border bg-elevated px-4 py-2 text-sm text-secondary transition hover:border-border-strong hover:text-primary [&::-webkit-details-marker]:hidden">
            Metronome
          </summary>
          <div className="absolute right-0 top-full z-10 mt-2 w-72 rounded-lg border border-border bg-card p-4 shadow-lg">
            <Metronome defaultBpm={defaultBpm} />
          </div>
        </details>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <StandBody payload={payload} />
        </div>
      </main>

      <footer className="shrink-0 space-y-3 border-t border-border bg-base px-4 py-3 sm:px-6 lg:hidden">
        <Button type="button" className="w-full" onClick={onEndSession}>
          End session
        </Button>
        <div className="flex justify-center">
          <DiscardSessionButton sessionId={sessionId} />
        </div>
        {footer}
      </footer>

      {footer ? (
        <div className="hidden shrink-0 border-t border-border px-4 py-3 text-center text-xs text-muted sm:px-6 lg:block">
          {footer}
        </div>
      ) : null}
    </div>
  );

  if (!mounted) return null;
  return createPortal(shell, document.body);
}
