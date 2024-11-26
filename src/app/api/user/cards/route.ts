import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || session.user.id;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Get user's cards with pagination
    const [cards, total] = await Promise.all([
      prisma.card.findMany({
        where: {
          owners: {
            some: {
              id: userId
            }
          }
        },
        include: {
          owners: {
            select: {
              id: true,
              name: true,
              image: true
            }
          },
          listing: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.card.count({
        where: {
          owners: {
            some: {
              id: userId
            }
          }
        }
      })
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return NextResponse.json({
      cards,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        hasMore,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    console.error('[GET_CARDS_ERROR]', error);
    return NextResponse.json(
      { error: "Failed to fetch cards" },
      { status: 500 }
    );
  }
}