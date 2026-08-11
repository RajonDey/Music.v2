import { Button, TextInput } from "@music/ui";
import type { DriftPocket } from "@music/types";
import { addDriftLine, promoteDriftItem } from "@/app/(private)/songs/drift-actions";
import { driftItemLabel } from "@/lib/drift-parse";
import { DeleteDriftPocketButton } from "./DeleteDriftPocketButton";
import { LetDriftGoButton } from "./LetDriftGoButton";

export function DriftPocketCard({ pocket }: { pocket: DriftPocket }) {
  const addLine = addDriftLine.bind(null, pocket.id);

  return (
    <div className="rounded-2xl border border-border bg-card/50 px-5 py-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-xl tracking-tightish text-primary">{pocket.name}</h2>
        <DeleteDriftPocketButton listId={pocket.id} listName={pocket.name} />
      </div>

      {pocket.items.length > 0 ? (
        <ul className="mt-4 divide-y divide-border">
          {pocket.items.map((item) => {
            const label = driftItemLabel(item);
            return (
              <li
                key={item.id}
                className="flex flex-col gap-3 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-display text-base leading-snug text-primary">{label}</p>
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-0.5 inline-block truncate text-xs text-accent hover:underline"
                    >
                      Listen
                    </a>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <form action={promoteDriftItem.bind(null, item.id)}>
                    <Button type="submit" variant="soft" size="sm">
                      Start a notebook
                    </Button>
                  </form>
                  <LetDriftGoButton itemId={item.id} label={label} />
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-muted">Nothing here yet. That&apos;s fine.</p>
      )}

      <form action={addLine} className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <label htmlFor={`drift-line-${pocket.id}`} className="sr-only">
          Add a song name or link to {pocket.name}
        </label>
        <TextInput
          id={`drift-line-${pocket.id}`}
          name="line"
          required
          placeholder="A name, or a YouTube link"
          autoComplete="off"
        />
        <Button type="submit" size="sm" className="shrink-0 self-start">
          Add
        </Button>
      </form>
    </div>
  );
}
