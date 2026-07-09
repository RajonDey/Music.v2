"use client";

import { Button, Card, FieldLabel, SelectInput, TextInput } from "@music/ui";
import { SKILL_RESOURCE_KINDS, type SkillResource } from "@music/types";
import {
  addSkillResource,
  deleteSkillResource,
  moveSkillResourceDown,
  moveSkillResourceUp,
  updateSkillResource,
} from "@/app/(private)/skills/actions";
import { ConfirmRemoveForm } from "@/components/ui/ConfirmRemoveForm";
import { SkillReorderButtons } from "@/components/skills/SkillReorderButtons";

const MAX_RESOURCES = 5;

const kindLabels: Record<string, string> = {
  tutorial: "Tutorial",
  exercise: "Exercise",
  youtube: "YouTube",
  backing: "Backing track",
  reference: "Reference",
  tab: "Tab",
  other: "Link",
};

function ResourceEditor({
  resource,
  skillId,
  index,
  total,
}: {
  resource: SkillResource;
  skillId: string;
  index: number;
  total: number;
}) {
  return (
    <div className="rounded-lg border border-border bg-elevated">
      <div className="flex items-center gap-2 px-3.5 py-2.5">
        <SkillReorderButtons
          skillId={skillId}
          itemId={resource.id}
          index={index}
          total={total}
          moveUp={moveSkillResourceUp}
          moveDown={moveSkillResourceDown}
        />
        <a
          href={resource.url}
          target="_blank"
          rel="noreferrer"
          className="min-w-0 flex-1 truncate text-sm text-secondary transition hover:text-primary"
        >
          <span className="text-xs text-muted">
            {kindLabels[resource.kind] ?? "Link"} ·{" "}
          </span>
          {resource.label}
        </a>
        <ConfirmRemoveForm
          action={deleteSkillResource.bind(null, resource.id, skillId)}
          confirmMessage={`Remove "${resource.label}" from your resources dock?\n\nThis cannot be undone.`}
          aria-label={`Remove ${resource.label}`}
        >
          Remove
        </ConfirmRemoveForm>
      </div>
      <details className="border-t border-border">
        <summary className="cursor-pointer list-none px-3.5 py-2 text-xs text-accent transition hover:text-accent-strong [&::-webkit-details-marker]:hidden">
          Edit label or link
        </summary>
        <form
          action={updateSkillResource.bind(null, resource.id, skillId)}
          className="space-y-3 border-t border-border px-3.5 py-3"
        >
          <div>
            <FieldLabel htmlFor={`skill-res-label-${resource.id}`}>Label</FieldLabel>
            <TextInput
              id={`skill-res-label-${resource.id}`}
              name="label"
              required
              defaultValue={resource.label}
            />
          </div>
          <div>
            <FieldLabel htmlFor={`skill-res-url-${resource.id}`}>Link</FieldLabel>
            <TextInput
              id={`skill-res-url-${resource.id}`}
              name="url"
              type="url"
              required
              defaultValue={resource.url}
            />
          </div>
          <div>
            <FieldLabel htmlFor={`skill-res-kind-${resource.id}`}>Type</FieldLabel>
            <SelectInput
              id={`skill-res-kind-${resource.id}`}
              name="kind"
              defaultValue={resource.kind}
            >
              {SKILL_RESOURCE_KINDS.map((kind) => (
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
      </details>
    </div>
  );
}

export function SkillResourcesDock({
  skillId,
  resources,
}: {
  skillId: string;
  resources: SkillResource[];
}) {
  const atCap = resources.length >= MAX_RESOURCES;

  return (
    <Card className="space-y-4">
      <div>
        <h2 className="font-display text-lg text-primary">Resources</h2>
        <p className="mt-1 text-sm text-muted">
          Tutorials, exercises, backing tracks. Saved for when you sit down.
        </p>
      </div>

      {resources.length > 0 ? (
        <div className="space-y-2">
          {resources.map((resource, index) => (
            <ResourceEditor
              key={resource.id}
              resource={resource}
              skillId={skillId}
              index={index}
              total={resources.length}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-secondary">Nothing docked yet.</p>
      )}

      {atCap ? (
        <p className="text-xs text-muted">
          {MAX_RESOURCES} links saved. Remove one to add another. Top {Math.min(3, MAX_RESOURCES)}{" "}
          show on the Stand.
        </p>
      ) : (
        <details>
          <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-sm text-accent transition hover:text-accent-strong [&::-webkit-details-marker]:hidden">
            <span aria-hidden>+</span> Add a resource
          </summary>
          <form
            action={addSkillResource.bind(null, skillId)}
            className="mt-3 space-y-4 rounded-lg border border-border bg-elevated p-4"
          >
            <div>
              <FieldLabel htmlFor="skill-res-label">Label</FieldLabel>
              <TextInput
                id="skill-res-label"
                name="label"
                required
                placeholder="Tutorial by …"
              />
            </div>
            <div>
              <FieldLabel htmlFor="skill-res-url">Link</FieldLabel>
              <TextInput id="skill-res-url" name="url" type="url" required placeholder="https://…" />
            </div>
            <div>
              <FieldLabel htmlFor="skill-res-kind">Type</FieldLabel>
              <SelectInput id="skill-res-kind" name="kind" defaultValue="tutorial">
                {SKILL_RESOURCE_KINDS.map((kind) => (
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
      )}
    </Card>
  );
}
