import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith("/signin");
  const isApiAuth = req.nextUrl.pathname.startsWith("/api/auth");

  if (isAuthPage || isApiAuth) return NextResponse.next();

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/signin", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/vehicles/:path*", "/api/vehicles/:path*", "/api/maintenance/:path*", "/api/reminders/:path*"],
};
