"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { DeleteSongButton } from "@/components/songs/DeleteSongButton";

export function SongCardMenu({ songId, songName }: { songId: string; songName: string }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      const el = detailsRef.current;
      if (!el?.open) return;
      if (!el.contains(event.target as Node)) {
        el.open = false;
      }
    }

    document.addEventListener("click", closeOnOutsideClick);
    return () => document.removeEventListener("click", closeOnOutsideClick);
  }, []);

  return (
    <details ref={detailsRef} className="relative shrink-0">
      <summary
        className="grid h-8 w-8 cursor-pointer list-none place-items-center rounded-lg text-secondary transition hover:bg-elevated hover:text-primary [&::-webkit-details-marker]:hidden"
        aria-label={`Options for ${songName}`}
      >
        <span aria-hidden className="text-base leading-none tracking-widest">
          ···
        </span>
      </summary>
      <div
        className="absolute right-0 z-20 mt-1 min-w-[12.5rem] overflow-hidden rounded-lg border border-border bg-card py-1 shadow-lg"
        role="menu"
      >
        <Link
          href={`/songs/${songId}`}
          role="menuitem"
          className="block px-3.5 py-2.5 text-sm text-secondary transition hover:bg-elevated hover:text-primary"
          onClick={() => {
            if (detailsRef.current) detailsRef.current.open = false;
          }}
        >
          Open notebook
        </Link>
        <Link
          href={`/songs/${songId}#notebook-settings`}
          role="menuitem"
          className="block px-3.5 py-2.5 text-sm text-secondary transition hover:bg-elevated hover:text-primary"
          onClick={() => {
            if (detailsRef.current) detailsRef.current.open = false;
          }}
        >
          Notebook settings
        </Link>
        <div className="border-t border-border px-3.5 py-2" role="none">
          <DeleteSongButton songId={songId} songName={songName} />
        </div>
      </div>
    </details>
  );
}
