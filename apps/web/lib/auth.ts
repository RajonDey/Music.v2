import { createHash } from "crypto";

export const AUTH_COOKIE = "music_os_auth";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function authToken(password: string): string {
  return createHash("sha256")
    .update(`${password}:music-os-unlock`)
    .digest("hex");
}

/**
 * Edge-runtime-safe equivalent of {@link authToken}. Next.js middleware runs on
 * the Edge runtime, which has no Node `crypto` module — so it must hash via the
 * Web Crypto API. Produces the same SHA-256 hex digest as {@link authToken}.
 */
export async function authTokenEdge(password: string): Promise<string> {
  const data = new TextEncoder().encode(`${password}:music-os-unlock`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
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
    pathname.startsWith("/songs") ||
    pathname.startsWith("/skills") ||
    pathname.startsWith("/vocal") ||
    pathname.startsWith("/report") ||
    pathname.startsWith("/api/coach")
  );
}
