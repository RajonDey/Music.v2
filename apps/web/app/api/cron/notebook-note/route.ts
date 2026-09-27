import { NextResponse } from "next/server";
import { Resend } from "resend";
import { authorizeCron } from "@/lib/cron-auth";
import { getBackupEmailEnv } from "@/lib/env";
import { buildNotebookNote } from "@/lib/notebook-note";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  let env: ReturnType<typeof getBackupEmailEnv>;
  try {
    env = getBackupEmailEnv();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Notebook email is not configured.";
    return NextResponse.json({ error: message }, { status: 503 });
  }

  if (!authorizeCron(request, env.CRON_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const note = await buildNotebookNote();
    if (!note) {
      return NextResponse.json({ ok: true, sent: false });
    }

    const resend = new Resend(env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: env.BACKUP_FROM_EMAIL,
      to: env.BACKUP_EMAIL,
      subject: note.subject,
      text: note.text,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }

    return NextResponse.json({ ok: true, sent: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Notebook email failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
