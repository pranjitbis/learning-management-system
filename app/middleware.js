import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

export function middleware(request) {
  const token = request.cookies.get("lms_token")?.value;
  const { pathname } = request.nextUrl;

  // Routes that require authentication
  const protectedRoutes = ["/admin", "/dashboard"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) return NextResponse.next();

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const decoded = verify(token, process.env.NEXTAUTH_SECRET);
    
    // Only allow admin role to access /admin
    if (pathname.startsWith("/admin") && decoded.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Add user info to headers for API routes to use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decoded.userId);
    requestHeaders.set('x-user-role', decoded.role);
    requestHeaders.set('x-user-email', decoded.email);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    
    return response;

  } catch (err) {
    console.error("Middleware token verification error:", err.message);
    
    // Clear invalid token
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("lms_token");
    return response;
  }
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/dashboard", "/dashboard/:path*"],
};