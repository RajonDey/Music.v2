import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, authTokenEdge, isPrivatePath } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isPrivatePath(pathname)) {
    return NextResponse.next();
  }

  const password = process.env.MUSIC_OS_PASSWORD;
  if (!password) {
    return NextResponse.redirect(new URL("/login?error=config", request.url));
  }

  const expected = await authTokenEdge(password);
  const cookie = request.cookies.get(AUTH_COOKIE)?.value;

  if (cookie !== expected) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/studio/:path*",
    "/journey/:path*",
    "/releases/:path*",
    "/songs/:path*",
    "/skills/:path*",
    "/vocal/:path*",
    "/report/:path*",
    "/api/coach/:path*",
  ],
};
