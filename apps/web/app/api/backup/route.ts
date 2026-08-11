import { NextResponse } from "next/server";
import { backupFilename, buildBackupDump, serializeBackup } from "@/lib/backup";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dump = await buildBackupDump();
    const body = serializeBackup(dump);
    const filename = backupFilename(dump.exported_at);

    return new NextResponse(body, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Backup failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
