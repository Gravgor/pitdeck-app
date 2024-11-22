import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function withAuth(
  request: Request,
  handler: (session: any) => Promise<NextResponse>
) {
  try {
    // Rate limiting


    // Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Performance monitoring
    const start = performance.now();
    const response = await handler(session);
    const duration = performance.now() - start;

    // Add timing header
    response.headers.set('X-Response-Time', `${duration.toFixed(2)}ms`);

    return response;
  } catch (error) {
    console.error('[API_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 