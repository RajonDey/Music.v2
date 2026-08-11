import { SectionLabel } from "@music/ui";
import { getSongs } from "@/lib/songs";
import { getDriftShelf } from "@/lib/drifts";
import { searchSongs } from "@/lib/musicbrainz";
import { parseSongRoomView } from "@/lib/song-room";
import { AddSong } from "@/components/songs/AddSong";
import { SongFinder } from "@/components/songs/SongFinder";
import { DbSetupNotice } from "@/components/songs/DbSetupNotice";
import { DriftPocketCard } from "@/components/songs/DriftSection";
import { SongRoomNav } from "@/components/songs/SongRoomNav";
import { CategoryFilter } from "@/components/songs/CategoryFilter";
import { AddCategoryForm } from "@/components/songs/AddCategoryForm";
import { NotebookCategoryList } from "@/components/songs/NotebookCategoryList";

export const dynamic = "force-dynamic";

export default async function SongsPage({
  searchParams,
}: {
  searchParams: Promise<{
    find?: string;
    artist?: string;
    view?: string;
    category?: string;
  }>;
}) {
  const {
    find,
    artist: artistParam,
    view: viewParam,
    category: categoryParam,
  } = await searchParams;
  const title = (find ?? "").trim();
  const artist = (artistParam ?? "").trim();
  const view = parseSongRoomView(viewParam);

  const [{ active, completed, dbReady }, drift] = await Promise.all([
    getSongs(),
    getDriftShelf(),
  ]);
  const categories = drift.pockets;
  const categoryId =
    categoryParam && categories.some((category) => category.id === categoryParam)
      ? categoryParam
      : null;

  const listPockets = categoryId
    ? drift.pockets.filter((pocket) => pocket.id === categoryId)
    : drift.pockets;

  const matches =
    title.length > 0 || artist.length > 0
      ? await searchSongs(title, artist || null)
      : [];

  const growing = categoryId
    ? active.filter((song) => song.category_id === categoryId)
    : active;
  const shelf = categoryId
    ? completed.filter((song) => song.category_id === categoryId)
    : completed;

  return (
    <div className="space-y-7">
      <div>
        <SectionLabel>Song Room</SectionLabel>
        <h1 className="mt-4 font-display text-3xl tracking-tightish text-primary sm:text-4xl">
          Your songs
        </h1>
        <p className="mt-3 max-w-prose leading-relaxed text-secondary">
          List is what caught you. Notebook is where you sit with one. Same
          categories on both — keep the ones that fit, let the rest go.
        </p>
      </div>

      {!drift.dbReady && !dbReady ? (
        <DbSetupNotice />
      ) : (
        <>
          <SongRoomNav
            view={view}
            categoryId={categoryId}
            find={title || undefined}
            artist={artist || undefined}
          />

          {view === "list" ? (
            <div className="space-y-5">
              {!drift.dbReady ? (
                <p className="rounded-2xl border border-dashed border-border bg-card/50 px-5 py-6 text-sm text-secondary">
                  Songs List needs{" "}
                  <code className="rounded bg-elevated px-1.5 py-0.5 text-xs text-primary">
                    20260811000000_drift_pockets.sql
                  </code>
                  . Apply it, then refresh.
                </p>
              ) : (
                <>
                  <CategoryFilter
                    view={view}
                    categories={categories}
                    categoryId={categoryId}
                  />
                  {listPockets.length > 0 ? (
                    <div className="space-y-4">
                      {listPockets.map((pocket) => (
                        <DriftPocketCard key={pocket.id} pocket={pocket} />
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-2xl border border-dashed border-border bg-card/50 px-5 py-8 text-center text-sm text-secondary">
                      Name a category, then dump titles or links into it.
                    </p>
                  )}
                  <AddCategoryForm />
                </>
              )}
            </div>
          ) : null}

          {view === "notebook" ? (
            !dbReady ? (
              <DbSetupNotice />
            ) : (
              <div className="space-y-5">
                <CategoryFilter
                  view={view}
                  categories={categories}
                  categoryId={categoryId}
                  find={title || undefined}
                  artist={artist || undefined}
                />
                <AddSong categories={categories} defaultCategoryId={categoryId} />
                <SongFinder
                  title={title}
                  artist={artist}
                  matches={matches}
                  categories={categories}
                  defaultCategoryId={categoryId}
                />
                <NotebookCategoryList
                  songs={growing}
                  categories={categories}
                  categoryId={categoryId}
                  emptyLabel={
                    categoryId
                      ? "No notebooks in this category yet."
                      : "No songs yet. Add the one on your mind right now."
                  }
                />
                {shelf.length > 0 ? (
                  <div className="space-y-4 border-t border-border pt-6">
                    <SectionLabel>Completed shelf</SectionLabel>
                    <NotebookCategoryList
                      songs={shelf}
                      categories={categories}
                      categoryId={categoryId}
                      emptyLabel="Nothing on the shelf in this category yet."
                    />
                  </div>
                ) : null}
              </div>
            )
          ) : null}
        </>
      )}
    </div>
  );
}
