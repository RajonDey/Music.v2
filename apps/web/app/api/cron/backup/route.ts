import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  backupFilename,
  buildBackupDump,
  previousMonthTitle,
  serializeBackup,
} from "@/lib/backup";
import { getBackupEmailEnv } from "@/lib/env";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorizeCron(request: Request, secret: string): boolean {
  const header = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function GET(request: Request) {
  let env: ReturnType<typeof getBackupEmailEnv>;
  try {
    env = getBackupEmailEnv();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Backup email is not configured.";
    return NextResponse.json({ error: message }, { status: 503 });
  }

  if (!authorizeCron(request, env.CRON_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const dump = await buildBackupDump();
    const body = serializeBackup(dump);
    const filename = backupFilename(dump.exported_at);
    const monthTitle = previousMonthTitle();

    const resend = new Resend(env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: env.BACKUP_FROM_EMAIL,
      to: env.BACKUP_EMAIL,
      subject: `Your Music OS notebook — ${monthTitle}`,
      text: [
        `Here's a copy of your Music OS notebook as of ${dump.exported_at}.`,
        "",
        "Keep this file somewhere you own. If the app ever loses a row, this JSON is enough to put it back.",
        "",
      ].join("\n"),
      attachments: [
        {
          filename,
          content: Buffer.from(body),
        },
      ],
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }

    return NextResponse.json({ ok: true, filename, exported_at: dump.exported_at });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Backup email failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
