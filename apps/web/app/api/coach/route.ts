import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Coach API ships in Phase 1, step 4." },
    { status: 501 },
  );
}
