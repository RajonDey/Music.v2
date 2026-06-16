import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE, authCookieOptions, authToken } from "@/lib/auth";

export async function POST(request: Request) {
  const password = process.env.MUSIC_OS_PASSWORD;
  if (!password) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const body = (await request.json()) as { password?: string };
  if (body.password !== password) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, authToken(password), authCookieOptions());

  return NextResponse.json({ ok: true });
}
