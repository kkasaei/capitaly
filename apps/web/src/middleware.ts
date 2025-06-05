import { clerkMiddleware } from '@clerk/nextjs/server';

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default clerkMiddleware();

export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    '/((?!.+\\.[\\w]+$|_next|api/trpc).*)',
    // Match all API routes
    '/api/:path*',
  ],
};