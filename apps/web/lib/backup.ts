import "server-only";
import { createServiceClient } from "./supabase";

export const BACKUP_VERSION = 1;
export const BACKUP_APP = "music-os";

export const BACKUP_TABLES = [
  "songs",
  "song_parts",
  "song_resources",
  "song_stage_log",
  "sessions",
  "session_songs",
  "session_skills",
  "weekly_reflections",
  "monthly_reflections",
  "coach_messages",
  "skills",
  "skill_states",
  "skill_resources",
  "skill_moments",
  "skill_snapshots",
  "vocal_range",
  "vocal_warmups",
  "vocal_exercises",
  "vocal_logs",
  "drift_lists",
  "drift_items",
] as const;

export type BackupTableName = (typeof BACKUP_TABLES)[number];

export type BackupDump = {
  version: typeof BACKUP_VERSION;
  app: typeof BACKUP_APP;
  exported_at: string;
  tables: Record<BackupTableName, unknown[]>;
};

const PAGE_SIZE = 1000;

async function fetchAllRows(
  client: ReturnType<typeof createServiceClient>,
  table: BackupTableName,
): Promise<unknown[]> {
  const rows: unknown[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await client
      .from(table)
      .select("*")
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      throw new Error(`Backup failed on ${table}: ${error.message}`);
    }

    const batch = data ?? [];
    rows.push(...batch);
    if (batch.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return rows;
}

export async function buildBackupDump(): Promise<BackupDump> {
  const client = createServiceClient();
  const exportedAt = new Date();

  const entries = await Promise.all(
    BACKUP_TABLES.map(async (table) => {
      const rows = await fetchAllRows(client, table);
      return [table, rows] as const;
    }),
  );

  return {
    version: BACKUP_VERSION,
    app: BACKUP_APP,
    exported_at: exportedAt.toISOString(),
    tables: Object.fromEntries(entries) as BackupDump["tables"],
  };
}

export function serializeBackup(dump: BackupDump): string {
  return `${JSON.stringify(dump, null, 2)}\n`;
}

export function backupFilename(exportedAt: string | Date): string {
  const date = typeof exportedAt === "string" ? new Date(exportedAt) : exportedAt;
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `music-os-${y}-${m}-${d}.json`;
}

/** Previous calendar month in Asia/Dhaka — used for the 1st-of-month email subject. */
export function previousMonthTitle(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(now);
  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  if (!year || !month) {
    return now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }
  const prev = new Date(Date.UTC(year, month - 2, 1));
  return prev.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
