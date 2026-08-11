import { SectionLabel } from "@music/ui";
import type { DriftList, Song } from "@music/types";
import { SongRoomCard } from "./SongRoomCard";

type Group = {
  id: string;
  name: string;
  songs: Song[];
};

function groupByCategory(songs: Song[], categories: DriftList[]): Group[] {
  const groups: Group[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    songs: songs.filter((song) => song.category_id === category.id),
  }));

  const unfiled = songs.filter((song) => !song.category_id);
  if (unfiled.length > 0) {
    groups.push({ id: "unfiled", name: "Not filed yet", songs: unfiled });
  }

  return groups.filter((group) => group.songs.length > 0);
}

export function NotebookCategoryList({
  songs,
  categories,
  categoryId,
  emptyLabel,
}: {
  songs: Song[];
  categories: DriftList[];
  categoryId: string | null;
  emptyLabel: string;
}) {
  const visible = categoryId
    ? songs.filter((song) => song.category_id === categoryId)
    : songs;

  if (visible.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-card/50 px-5 py-8 text-center text-sm text-secondary">
        {emptyLabel}
      </p>
    );
  }

  const groups = categoryId
    ? [
        {
          id: categoryId,
          name: categories.find((category) => category.id === categoryId)?.name ?? "Category",
          songs: visible,
        },
      ]
    : groupByCategory(visible, categories);

  return (
    <div className="space-y-7">
      {groups.map((group) => (
        <section key={group.id} className="space-y-4">
          <SectionLabel>{group.name}</SectionLabel>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {group.songs.map((song) => (
              <SongRoomCard key={song.id} song={song} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
