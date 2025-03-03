import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export function middleware(req) {
  const cookieStore = cookies();
  const token = cookieStore.get("jwt")?.value;

  // If user is already logged in and tries to access "/", redirect to "/dashboard"
  if (req.nextUrl.pathname === "/" && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next(); // Proceed with the request
}

// Apply middleware only to the "/" route
export const config = {
  matcher: ["/"],
};
