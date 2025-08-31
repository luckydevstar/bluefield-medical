// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith('/admin')) return NextResponse.next();

  const token = req.cookies.get('bf_admin')?.value;
  // allow hitting /admin/login without token
  if (req.nextUrl.pathname.startsWith('/admin/login')) return NextResponse.next();
  if (!token) return NextResponse.redirect(new URL('/admin/login', req.url));

  // lightweight verify by presence; the API routes do strong verify
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
