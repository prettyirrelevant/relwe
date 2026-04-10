import { NextResponse, NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const PROTECTED_PATHS = ["/book", "/trips", "/profile"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);
  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/book/:path*", "/trips/:path*", "/profile/:path*"],
};
