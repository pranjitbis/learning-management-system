import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "supersecret";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Define protected routes
  const protectedRoutes = [
    '/dashboard',
    '/app/admin',
    '/app/admin/user',
    "/app/admin/hackthon",
    '/app/admin/courses',
    '/app/admin/certificates'
  ];

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Get token from cookies
  const token = request.cookies.get('lms_token')?.value;

  // If no token and trying to access protected route, redirect to unauthorized
  if (isProtectedRoute && !token) {
    const unauthorizedUrl = new URL('/unauthorized', request.url);
    return NextResponse.redirect(unauthorizedUrl);
  }

  // If token exists, verify it
  if (token) {
    try {
      const decoded = verify(token, JWT_SECRET);
      
      // Check if user is trying to access admin routes without admin role
      const isAdminRoute = pathname.startsWith('/app/admin');
      if (isAdminRoute && decoded.role !== 'ADMIN') {
        const unauthorizedUrl = new URL('/unauthorized', request.url);
        return NextResponse.redirect(unauthorizedUrl);
      }
      
      // Add user info to request headers for API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', decoded.userId);
      requestHeaders.set('x-user-role', decoded.role);
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (err) {
      // Token is invalid
      if (isProtectedRoute) {
        const unauthorizedUrl = new URL('/unauthorized', request.url);
        return NextResponse.redirect(unauthorizedUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/app/admin/:path*',
    '/api/hackthon'
  ]
};