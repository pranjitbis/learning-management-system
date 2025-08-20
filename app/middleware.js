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

    // Only allow admin email to access /admin
    if (pathname.startsWith("/admin") && decoded.email !== "pra") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch (err) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("lms_token");
    return response;
  }
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/dashboard", "/dashboard/:path*"],
};
