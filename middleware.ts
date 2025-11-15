import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';

  // Extract subdomain from hostname
  // Expected format: {username}.domain.com
  const parts = hostname.split('.');

  // For localhost development, you might have: username.localhost:3000
  // For production: username.madea.blog
  let username = '';

  if (parts.length >= 2) {
    // Get the first part as username
    username = parts[0];

    // Filter out common prefixes that aren't usernames
    if (username === 'www' || username === 'localhost' || parts.length < 2) {
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
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
