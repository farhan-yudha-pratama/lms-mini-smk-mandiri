import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = path === '/login' || path === '/register' || path === '/unauthorized';
  const isProtectedRoute = !isPublicRoute;

  const cookieStore = await cookies();
  const sessionValue = cookieStore.get('session')?.value;
  const session = sessionValue ? await decrypt(sessionValue) : null;

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  if (isPublicRoute && session) {
    // Redirect based on role if they try to access login but already logged in
    if (session.role === 'SUPERADMIN' || session.role === 'GURU') {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
    } else {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }
  }

  // Role-based protection for /dashboard
  if (session && path.startsWith('/dashboard') && session.role !== 'SUPERADMIN' && session.role !== 'GURU') {
    return NextResponse.redirect(new URL('/unauthorized', req.nextUrl));
  }

  // Handle class join logic for MURID
  if (session && session.role === 'MURID') {
    const hasClass = !!session.classId;
    
    // If they don't have a class and are not on /join-class, force them to /join-class
    if (!hasClass && path !== '/join-class') {
      return NextResponse.redirect(new URL('/join-class', req.nextUrl));
    }

    // If they already have a class and try to access /join-class, send them to homepage
    if (hasClass && path === '/join-class') {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - \..* (matches any file with an extension, like .png, .css, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
