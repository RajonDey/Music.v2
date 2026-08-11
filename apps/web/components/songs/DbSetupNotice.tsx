import { Card } from "@music/ui";

const MIGRATIONS = [
  "20260616000000_initial_schema.sql",
  "20260618000000_music_os_v2.sql",
  "20260619000000_phase6_song_fields.sql",
  "20260623000000_session_anchors.sql",
  "20260624000000_skill_resources.sql",
  "20260625000000_skill_domain.sql",
  "20260626000000_practice_kind.sql",
  "20260811000000_drift_pockets.sql",
  "20260811000001_song_category.sql",
  "20260811000002_seed_music_categories.sql",
] as const;

export function DbSetupNotice() {
  return (
    <Card variant="elevated" className="space-y-3">
      <h2 className="font-display text-lg text-primary">
        Your notebook is ready. It just needs a database.
      </h2>
      <p className="text-sm leading-relaxed text-secondary">
        Music OS is wired up, but Supabase is missing tables or columns. Apply every
        migration below in order, then run the seed.
      </p>
      <ol className="list-decimal space-y-1 pl-5 text-sm text-secondary">
        <li>Open the Supabase dashboard → SQL editor for this project.</li>
        <li>
          Run each file in{" "}
          <code className="rounded bg-elevated px-1.5 py-0.5 text-xs text-primary">
            supabase/migrations/
          </code>{" "}
          in order:
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            {MIGRATIONS.map((file) => (
              <li key={file}>
                <code className="text-primary">{file}</code>
              </li>
            ))}
          </ul>
        </li>
        <li>
          Run{" "}
          <code className="rounded bg-elevated px-1.5 py-0.5 text-xs text-primary">
            supabase/seed.sql
          </code>{" "}
          (or{" "}
          <code className="rounded bg-elevated px-1.5 py-0.5 text-xs text-primary">
            node apps/web/scripts/seed-remote.mjs
          </code>
          ).
        </li>
        <li>Refresh this page.</li>
      </ol>
      <p className="text-xs text-muted">
        To verify everything:{" "}
        <code className="text-primary">node apps/web/scripts/freeze-check.mjs</code>
      </p>
    </Card>
  );
}
