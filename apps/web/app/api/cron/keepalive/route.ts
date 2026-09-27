import { NextResponse } from "next/server";
import { authorizeCron } from "@/lib/cron-auth";
import { getCronSecret } from "@/lib/env";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/** Free-tier Supabase pauses after 7 idle days; one tiny read every few days keeps it awake. */
export async function GET(request: Request) {
  let secret: string;
  try {
    secret = getCronSecret();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Cron is not configured.";
    return NextResponse.json({ error: message }, { status: 503 });
  }

  if (!authorizeCron(request, secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await createServiceClient().from("songs").select("id").limit(1);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }

  return NextResponse.json({ ok: true, at: new Date().toISOString() });
}
