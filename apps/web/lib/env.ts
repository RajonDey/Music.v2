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
