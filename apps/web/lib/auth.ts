import { createHash } from "crypto";

export const AUTH_COOKIE = "music_os_auth";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function authToken(password: string): string {
  return createHash("sha256")
    .update(`${password}:music-os-unlock`)
    .digest("hex");
}

export function authCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: ONE_YEAR_SECONDS,
  };
}

export function isPrivatePath(pathname: string): boolean {
  return (
    pathname.startsWith("/studio") ||
    pathname.startsWith("/journey") ||
    pathname.startsWith("/releases") ||
    pathname.startsWith("/api/coach")
  );
}
