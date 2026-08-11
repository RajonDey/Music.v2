"use client";

import { useRouter } from "next/navigation";
import { FieldLabel, SelectInput } from "@music/ui";
import type { DriftList, SongRoomView } from "@music/types";
import { songRoomHref } from "@/lib/song-room";

export function CategoryFilter({
  view,
  categories,
  categoryId,
  find,
  artist,
}: {
  view: SongRoomView;
  categories: DriftList[];
  categoryId: string | null;
  find?: string;
  artist?: string;
}) {
  const router = useRouter();

  if (categories.length === 0) return null;

  return (
    <div className="max-w-xs">
      <FieldLabel htmlFor="song-room-category">Category</FieldLabel>
      <SelectInput
        id="song-room-category"
        value={categoryId ?? ""}
        onChange={(event) => {
          router.push(
            songRoomHref({
              view,
              categoryId: event.target.value || null,
              find,
              artist,
            }),
          );
        }}
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </SelectInput>
    </div>
  );
}
