// middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// IMPORTANT: This secret MUST be identical to what you use when signing
const JWT_SECRET =
  process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "supersecret";

// Helper to verify JWT with jose (Edge-compatible)
async function verifyToken(token) {
  const secret = new TextEncoder().encode(JWT_SECRET);
  // jwtVerify throws if invalid/expired
  const { payload } = await jwtVerify(token, secret, {
    algorithms: ["HS256"],
  });
  return payload; // e.g. { userId, role, iat, exp }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protected areas
  const isDashboard = pathname.startsWith("/dashboard");
  const isAdminArea = pathname.startsWith("/app/admin");

  // Read JWT from cookie (httpOnly cookie set at login)
  const token = request.cookies.get("lms_token")?.value;

  // If accessing protected routes without a token -> go to /login
  if ((isDashboard || isAdminArea) && !token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // If there is a token, verify it (and gate admin area)
  if (token) {
    try {
      const decoded = await verifyToken(token); // { userId, role }

      // Admin-only routes
      if (isAdminArea && decoded.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }

      // Allow request through
      return NextResponse.next();
    } catch (err) {
      // Invalid/expired token -> redirect to login & clear cookie
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      const res = NextResponse.redirect(url);
      res.cookies.set("lms_token", "", { maxAge: -1, path: "/" });
      return res;
    }
  }

  // Public routes
  return NextResponse.next();
}

// Only run middleware on pages that need it (NOT on /api)
export const config = {
  matcher: ["/dashboard/:path*", "/app/admin/:path*"],
};
