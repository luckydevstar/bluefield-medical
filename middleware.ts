// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const header = req.headers.get('x-admin-key');
    if (!process.env.ADMIN_KEY || header !== process.env.ADMIN_KEY) {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }
  return NextResponse.next();
}

// config: apply only to admin
export const config = { matcher: ['/admin/:path*'] };
