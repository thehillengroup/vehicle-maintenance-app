import { auth } from "./auth";
import { NextResponse } from "next/server";

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
  matcher: ["/dashboard/:path*", "/api/vehicles/:path*", "/api/maintenance/:path*", "/api/reminders/:path*"],
};
