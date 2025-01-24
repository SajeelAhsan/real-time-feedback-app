import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: { headers: request.headers },
    secret: process.env.NEXTAUTH_SECRET,
  });
  const url = request.nextUrl;

  if (token) {
    if (
      url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify')
    ) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  if (!token && url.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
  }
  /*else {
    if (
      url.pathname.startsWith('/dashboard') ||
      url.pathname.startsWith('/verify')
    ) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }*/
}

export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/dashboard/:path*',
    '/verify/:path*',
  ],
};
