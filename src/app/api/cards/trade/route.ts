import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { ListingStatus } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { cardId, price } = await req.json();
    
    const card = await prisma.card.update({
      where: {
        id: cardId,
        owners: {
          some: {
            id: session.user.id,
          },
        },
      },
      data: {
        isForSale: true,
        listing: {
          create: {
            price: price,
            status: ListingStatus.ACTIVE,
            sellerId: session.user.id,
          },
        },
      },
    });

    return NextResponse.json(card);
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
} 