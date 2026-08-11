import { z } from "zod";

const authEnvSchema = z.object({
  MUSIC_OS_PASSWORD: z.string().min(1),
});

const supabaseEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

export function getAuthPassword(): string {
  const parsed = authEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error("MUSIC_OS_PASSWORD is not configured.");
  }
  return parsed.data.MUSIC_OS_PASSWORD;
}

export function getSupabaseEnv() {
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
