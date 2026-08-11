import { SONG_ROOM_VIEWS, type SongRoomView } from "@music/types";

const LEGACY_VIEWS: Record<string, SongRoomView> = {
  drift: "list",
  growing: "notebook",
  shelf: "notebook",
};

export function parseSongRoomView(raw?: string): SongRoomView {
  if (raw && (SONG_ROOM_VIEWS as readonly string[]).includes(raw)) {
    return raw as SongRoomView;
  }
  if (raw && LEGACY_VIEWS[raw]) return LEGACY_VIEWS[raw];
  return "notebook";
}

export function songRoomHref({
  view,
  categoryId,
  find,
  artist,
}: {
  view: SongRoomView;
  categoryId?: string | null;
  find?: string;
  artist?: string;
}): string {
  const params = new URLSearchParams();
  if (view !== "notebook") params.set("view", view);
  if (categoryId) params.set("category", categoryId);
  if (find) params.set("find", find);
  if (artist) params.set("artist", artist);
  const query = params.toString();
  return query ? `/songs?${query}` : "/songs";
}
