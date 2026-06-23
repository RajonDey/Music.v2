"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase";

export async function clearCoachMessages(): Promise<void> {
  const supabase = createServiceClient();
  const today = new Date().toISOString().slice(0, 10);

  const { error } = await supabase
    .from("coach_messages")
    .delete()
    .eq("session_date", today);

  if (error) throw error;
  revalidatePath("/studio");
}
