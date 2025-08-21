// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Define protected routes
  const protectedRoutes = [
    '/dashboard',
    '/app/admin',
    '/app/admin/user',
    '/app/admin/courses',
    '/app/admin/certificates'
  ];

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Get token from cookies
  const token = request.cookies.get('lms_token')?.value;

  // Redirect to unauthorized if trying to access protected route without auth
  if (isProtectedRoute && !token) {
    const unauthorizedUrl = new URL('/unauthorized', request.url);
    unauthorizedUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(unauthorizedUrl);
  }



  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/app/admin/:path*',
    '/login'
  ]
};