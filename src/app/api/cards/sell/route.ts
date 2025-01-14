import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const sellCardSchema = z.object({
  cardId: z.string(),
  price: z.number().min(1).max(1000000), 
});

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await req.json();
    const validation = sellCardSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ 
        error: "Invalid request data",
        details: validation.error.errors 
      }, { status: 400 });
    }

    const { cardId, price } = validation.data;

    // Check if card exists and user owns it
    const card = await prisma.card.findFirst({
      where: {
        id: cardId,
        owners: {
          some: {
            id: session.user.id
          }
        }
      },
      include: {
        listing: true
      }
    });

    if (!card) {
      return NextResponse.json({ 
        error: "Card not found or you don't own this card" 
      }, { status: 404 });
    }

    // Check if card is already listed
    if (card.listing) {
      return NextResponse.json({ 
        error: "Card is already listed for sale" 
      }, { status: 400 });
    }

    const listing = await prisma.$transaction(async (tx) => {
      await tx.card.update({
        where: { id: cardId },
        data: { isForSale: true }
      });
    
      return tx.listing.create({
        data: {
          status: 'ACTIVE',
          price,
          card: {
            connect: {
              id: cardId
            }
          },
          seller: {
            connect: {
              id: session.user.id
            }
          }
        },
        include: {
          card: true,
          seller: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        }
      });
    });

    return NextResponse.json({ 
      message: "Card listed successfully",
      listing 
    });

  } catch (error) {
    console.error('[SELL_CARD_ERROR]', error);
    return NextResponse.json(
      { error: "Failed to list card for sale" },
      { status: 500 }
    );
  }
}

// Optional: Add a DELETE endpoint to cancel listing
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get('listingId');

    if (!listingId) {
      return NextResponse.json({ 
        error: "Listing ID is required" 
      }, { status: 400 });
    }

    // Check if listing exists and belongs to user
    const listing = await prisma.listing.findFirst({
      where: {
        id: listingId,
        sellerId: session.user.id
      }
    });

    if (!listing) {
      return NextResponse.json({ 
        error: "Listing not found or unauthorized" 
      }, { status: 404 });
    }

    // Delete the listing
    await prisma.listing.delete({
      where: {
        id: listingId
      }
    });

    return NextResponse.json({ 
      message: "Listing cancelled successfully" 
    });

  } catch (error) {
    console.error('[CANCEL_LISTING_ERROR]', error);
    return NextResponse.json(
      { error: "Failed to cancel listing" },
      { status: 500 }
    );
  }
}