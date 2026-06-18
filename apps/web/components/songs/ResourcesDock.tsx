"use client";

import { Button, Card, FieldLabel, SelectInput, TextInput } from "@music/ui";
import { RESOURCE_KINDS, type SongResource } from "@music/types";
import {
  addResource,
  deleteResource,
  updateResource,
} from "@/app/(private)/songs/actions";

const kindLabels: Record<string, string> = {
  youtube: "YouTube",
  backing: "Backing track",
  reference: "Reference",
  tab: "Tab",
  other: "Link",
};

function ResourceEditor({
  resource,
  songId,
}: {
  resource: SongResource;
  songId: string;
}) {
  return (
    <details className="rounded-lg border border-border bg-elevated">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3.5 py-2.5 [&::-webkit-details-marker]:hidden">
        <a
          href={resource.url}
          target="_blank"
          rel="noreferrer"
          className="min-w-0 flex-1 truncate text-sm text-secondary transition hover:text-primary"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-xs text-muted">
            {kindLabels[resource.kind] ?? "Link"} ·{" "}
          </span>
          {resource.label}
        </a>
      </summary>
      <form
        action={updateResource.bind(null, resource.id, songId)}
        className="space-y-3 border-t border-border px-3.5 py-3"
      >
        <div>
          <FieldLabel htmlFor={`res-label-${resource.id}`}>Label</FieldLabel>
          <TextInput
            id={`res-label-${resource.id}`}
            name="label"
            required
            defaultValue={resource.label}
          />
        </div>
        <div>
          <FieldLabel htmlFor={`res-url-${resource.id}`}>Link</FieldLabel>
          <TextInput
            id={`res-url-${resource.id}`}
            name="url"
            type="url"
            required
            defaultValue={resource.url}
          />
        </div>
        <div>
          <FieldLabel htmlFor={`res-kind-${resource.id}`}>Type</FieldLabel>
          <SelectInput id={`res-kind-${resource.id}`} name="kind" defaultValue={resource.kind}>
            {RESOURCE_KINDS.map((kind) => (
              <option key={kind} value={kind}>
                {kindLabels[kind]}
              </option>
            ))}
          </SelectInput>
        </div>
        <Button type="submit" size="sm">
          Save
        </Button>
      </form>
      <form action={deleteResource.bind(null, resource.id, songId)} className="px-3.5 pb-3">
        <Button type="submit" variant="link" className="text-xs text-muted">
          Remove
        </Button>
      </form>
    </details>
  );
}

export function ResourcesDock({
  songId,
  resources,
}: {
  songId: string;
  resources: SongResource[];
}) {
  return (
    <Card className="space-y-4">
      <div>
        <h2 className="font-display text-lg text-primary">Resources</h2>
        <p className="mt-1 text-sm text-muted">
          A tutorial, a backing track, a voice memo — kept close.
        </p>
      </div>

      {resources.length > 0 ? (
        <div className="space-y-2">
          {resources.map((resource) => (
            <ResourceEditor key={resource.id} resource={resource} songId={songId} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-secondary">Nothing docked yet.</p>
      )}

      <details>
        <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-sm text-accent transition hover:text-accent-strong [&::-webkit-details-marker]:hidden">
          <span aria-hidden>+</span> Add a resource
        </summary>
        <form
          action={addResource.bind(null, songId)}
          className="mt-3 space-y-4 rounded-lg border border-border bg-elevated p-4"
        >
          <div>
            <FieldLabel htmlFor="res-label">Label</FieldLabel>
            <TextInput id="res-label" name="label" required placeholder="Tutorial by …" />
          </div>
          <div>
            <FieldLabel htmlFor="res-url">Link</FieldLabel>
            <TextInput id="res-url" name="url" type="url" required placeholder="https://…" />
          </div>
          <div>
            <FieldLabel htmlFor="res-kind">Type</FieldLabel>
            <SelectInput id="res-kind" name="kind" defaultValue="youtube">
              {RESOURCE_KINDS.map((kind) => (
                <option key={kind} value={kind}>
                  {kindLabels[kind]}
                </option>
              ))}
            </SelectInput>
          </div>
          <Button type="submit" size="sm">
            Dock it
          </Button>
        </form>
      </details>
    </Card>
  );
}
