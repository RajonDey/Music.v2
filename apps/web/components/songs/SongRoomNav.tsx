import Link from "next/link";
import type { SongRoomView } from "@music/types";
import { songRoomHref } from "@/lib/song-room";

const VIEWS: { id: SongRoomView; label: string }[] = [
  { id: "list", label: "Songs List" },
  { id: "notebook", label: "Songs Notebook" },
];

export function SongRoomNav({
  view,
  categoryId,
  find,
  artist,
}: {
  view: SongRoomView;
  categoryId?: string | null;
  find?: string;
  artist?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Song Room">
      {VIEWS.map((tab) => {
        const active = tab.id === view;
        return (
          <Link
            key={tab.id}
            href={songRoomHref({ view: tab.id, categoryId, find, artist })}
            role="tab"
            aria-selected={active}
            className={`rounded-full border px-4 py-2 text-sm transition duration-fast ${
              active
                ? "border-accent bg-accent-soft text-primary"
                : "border-border bg-elevated text-secondary hover:border-border-strong hover:text-primary"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
