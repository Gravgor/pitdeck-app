import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { withAuth } from '@/middleware/withAuth';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    '/achievements/:path*',
    '/packs/:path*',
    '/trading/:path*',
    '/marketplace/:path*',
    '/profile/:path*',
    '/map/:path*',
    '/quests/:path*',
    '/auth/:path*',
  ]
};

export async function middleware(request: NextRequest) {
  if (request.headers.get('host') === 'pitdeck-app-production.up.railway.app') {
    return NextResponse.redirect('https://pitdeck.app', { status: 301 });
  }
  const token = await getToken({ req: request });


  if (request.nextUrl.pathname === '/auth/signin' || request.nextUrl.pathname === '/auth/register') {
    return NextResponse.next();
  }


  if (!token) {
    const signInUrl = new URL('/auth/signin', request.url);
    return NextResponse.redirect(signInUrl);
  }

  if ((request.nextUrl.pathname === '/auth/signin' || request.nextUrl.pathname === '/auth/register') && token) {
    const collectionUrl = new URL('/collection', request.url);
    return NextResponse.redirect(collectionUrl);
  }

  try {
    // Run user checks in the background
    const userId = token.sub as string;
    
    // Create a background task for checks to not block the response
    const backgroundChecks = async () => {
      try {
        await Promise.all([
          // Collection milestones
          fetch(`${request.nextUrl.origin}/api/users/${token.id}/check-milestones`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          }),
          
          // Daily login
          fetch(`${request.nextUrl.origin}/api/users/${token.id}/daily-login`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          }),
          
          // Achievement checks
          fetch(`${request.nextUrl.origin}/api/users/${token.id}/check-achievements`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          })
        ]);
      } catch (error) {
        console.error('Background checks failed:', error);
      }
    };

    // Execute background checks without waiting
    backgroundChecks();

    // Update last active timestamp
    const updateLastActive = async () => {
      try {
        await fetch(`${request.nextUrl.origin}/api/users/${userId}/last-active`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
      } catch (error) {
        console.error('Failed to update last active:', error);
      }
    };

    // Execute last active update without waiting
    updateLastActive();

    // Continue with the request
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
} 