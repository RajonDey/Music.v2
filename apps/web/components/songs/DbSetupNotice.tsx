import { Card } from "@music/ui";

export function DbSetupNotice() {
  return (
    <Card variant="elevated" className="space-y-3">
      <h2 className="font-display text-lg text-primary">
        Your notebook is ready — it just needs a database
      </h2>
      <p className="text-sm leading-relaxed text-secondary">
        The Song Room is wired up, but the Music OS v2 tables haven&apos;t been
        created in Supabase yet. Apply the migration and seed, then refresh.
      </p>
      <ol className="list-decimal space-y-1 pl-5 text-sm text-secondary">
        <li>
          Open the Supabase dashboard → SQL editor for this project.
        </li>
        <li>
          Run{" "}
          <code className="rounded bg-elevated px-1.5 py-0.5 text-xs text-primary">
            supabase/migrations/20260618000000_music_os_v2.sql
          </code>
          .
        </li>
        <li>
          Then run{" "}
          <code className="rounded bg-elevated px-1.5 py-0.5 text-xs text-primary">
            supabase/seed.sql
          </code>{" "}
          to load your songs and skills.
        </li>
      </ol>
      <p className="text-xs text-muted">
        (The initial schema must be applied first if you haven&apos;t already.)
      </p>
    </Card>
  );
}
