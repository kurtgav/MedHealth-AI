import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Only protect dashboard routes - check for session cookie
  if (path.startsWith('/dashboard')) {
    const sessionToken = req.cookies.get('next-auth.session-token') || 
                        req.cookies.get('__Secure-next-auth.session-token');

    // If no session token, redirect to login
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Role-based access control is handled at the page level
    // Middleware just ensures user is authenticated
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};

