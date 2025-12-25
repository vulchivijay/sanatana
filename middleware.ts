import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Prevent direct access to certain folders by typing their URL.
// Adjust the matcher below as needed. This returns 403 for the matched paths.
export function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname;
  if (/^\/(assets|files|uploads)(\/|$)/.test(p)) {
    return new NextResponse('Forbidden', { status: 403 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/assets/:path*', '/files/:path*', '/uploads/:path*']
};
