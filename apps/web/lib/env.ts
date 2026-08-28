import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { z } from "zod";

const authEnvSchema = z.object({
  MUSIC_OS_PASSWORD: z.string().min(1),
});

const supabaseEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

let rootEnvLoaded = false;

/** apps/web/.env.local may ship empty placeholders; fall back to repo root .env. */
function ensureRootEnv() {
  if (rootEnvLoaded) return;
  rootEnvLoaded = true;

  const repoRoot = path.join(__dirname, "..", "..", "..");
  for (const name of [".env.local", ".env"]) {
    const file = path.join(repoRoot, name);
    if (!existsSync(file)) continue;

    for (const line of readFileSync(file, "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;

      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if ((process.env[key] === undefined || process.env[key] === "") && value) {
        process.env[key] = value;
      }
    }
  }
}

export function getAuthPassword(): string {
  ensureRootEnv();
  const parsed = authEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error("MUSIC_OS_PASSWORD is not configured.");
  }
  return parsed.data.MUSIC_OS_PASSWORD;
}

export function getSupabaseEnv() {
  ensureRootEnv();
  const parsed = supabaseEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(
      "Supabase env missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return parsed.data;
}

const backupEmailEnvSchema = z.object({
  RESEND_API_KEY: z.string().min(1),
  BACKUP_EMAIL: z.string().email(),
  CRON_SECRET: z.string().min(16),
  BACKUP_FROM_EMAIL: z.string().min(1).optional(),
});

export function getBackupEmailEnv() {
  ensureRootEnv();
  const parsed = backupEmailEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(
      "Backup email env missing. Set RESEND_API_KEY, BACKUP_EMAIL, and CRON_SECRET.",
    );
  }
  return {
    ...parsed.data,
    BACKUP_FROM_EMAIL:
      parsed.data.BACKUP_FROM_EMAIL ?? "Music OS <beth.t@example.com>",
  };
}
