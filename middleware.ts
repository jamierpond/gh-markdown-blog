import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';

  // Remove port if present
  const hostnameWithoutPort = hostname.split(':')[0];

  // Split hostname into parts
  const parts = hostnameWithoutPort.split('.');

  let username = '';

  // Only extract username if there are 3+ parts (subdomain.domain.tld)
  // Examples:
  // - "madea.blog" = 2 parts = no subdomain (root domain)
  // - "username.madea.blog" = 3 parts = username is subdomain
  // - "localtest.me" = 2 parts = no subdomain
  // - "username.localtest.me" = 3 parts = username is subdomain
  if (parts.length >= 3) {
    username = parts[0];

    // Filter out www
    if (username === 'www') {
      username = '';
    }
  }

  // Clone the request headers and add the username
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-github-username', username);

  // Return response with modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.png (favicon file)
     */
    '/((?!_next/static|_next/image).*)',
  ],
};
