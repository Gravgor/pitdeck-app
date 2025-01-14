import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TradeStatus } from "@prisma/client";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { id } = await params;
    const { cardIds, coins, note } = await request.json();

    // Validate input
    if (!Array.isArray(cardIds)) {
      return new NextResponse("Invalid card selection", { status: 400 });
    }

    if (typeof coins !== 'number' || coins < 0) {
      return new NextResponse("Invalid coins amount", { status: 400 });
    }

    // Get the trade with its current offers
    const trade = await prisma.trade.findUnique({
      where: { id },
      include: {
        sender: true,
        tradeOffers: {
          where: { userId: session.user.id }
        }
      }
    });

    if (!trade) {
      return new NextResponse("Trade not found", { status: 404 });
    }

    // Check if trade is still open
    if (trade.status !== TradeStatus.PENDING) {
      return new NextResponse("This trade is no longer active", { status: 400 });
    }

    // Check if trade hasn't expired
    if (trade.expiresAt && trade.expiresAt < new Date()) {
      return new NextResponse("This trade has expired", { status: 400 });
    }

    // Check if user is not offering to their own trade
    if (trade.senderId === session.user.id) {
      return new NextResponse("You cannot make an offer on your own trade", { status: 400 });
    }

    // Check if user already has an offer on this trade
    if (trade.tradeOffers.length > 0) {
      return new NextResponse("You already have an offer on this trade", { status: 400 });
    }

    // Verify user has enough coins
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { coins: true }
    });

    if (!user || user.coins < coins) {
      return new NextResponse("Insufficient coins", { status: 400 });
    }

    // Verify user owns all cards
    const userCards = await prisma.card.findMany({
      where: {
        id: { in: cardIds },
        owners: {
          some: { id: session.user.id }
        }
      }
    });

    if (userCards.length !== cardIds.length) {
      return new NextResponse("You don't own all selected cards", { status: 400 });
    }

    // Set offer expiration (48 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    // Create the offer in a transaction
    const offer = await prisma.$transaction(async (tx) => {
      // Create the offer
      const newOffer = await tx.tradeOffer.create({
        data: {
          tradeId: trade.id,
          userId: session.user.id,
          offeredCards: {
            connect: cardIds.map(id => ({ id }))
          },
          coins,
          note: note || undefined,
          status: 'PENDING',
          expiresAt
        },
        include: {
          offeredCards: true,
          user: true
        }
      });

      // Lock the coins
      await tx.user.update({
        where: { id: session.user.id },
        data: { coins: { decrement: coins } }
      });

      // Create notification for trade owner
      await tx.notification.create({
        data: {
          userId: trade.senderId,
          type: 'TRADE_OFFER',
          message: `${session.user.name} made an offer on your trade`,
          metadata: {
            tradeId: trade.id,
            offerId: newOffer.id
          }
        }
      });

      return newOffer;
    });

    // Revalidate trade page
    revalidatePath(`/trading/${id}/offer`);

    return NextResponse.json({
      success: true,
      offer
    });

  } catch (error) {
    console.error("[TRADE_OFFER_ERROR]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error",
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    const trade = await prisma.trade.findUnique({
      where: { 
        id: id 
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
            createdAt: true,
          }
        },
        offeredCards: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
            rarity: true,
            type: true,
            description: true,
            owners: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        },
        tradeOffers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              }
            },
            offeredCards: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                rarity: true,
                type: true,
                description: true,
              }
            }
          }
        }
      }
    });

    if (!trade) {
      return new NextResponse("Trade not found", { status: 404 });
    }

    // Check if trade is expired
    if (trade.expiresAt && trade.expiresAt < new Date()) {
      // Auto-update trade status if expired
      await prisma.trade.update({
        where: { id: trade.id },
        data: { status: TradeStatus.CANCELLED }
      });
      return new NextResponse("This trade has expired", { status: 410 });
    }

    // Enrich trade data with additional information
    const enrichedTrade = {
      ...trade,
      isOwner: trade.senderId === session.user.id,
      hasUserOffer: trade.tradeOffers.some(offer => 
        offer.user.id === session.user.id
      ),
      timeRemaining: trade.expiresAt ? 
        Math.max(0, Math.floor((new Date(trade.expiresAt).getTime() - new Date().getTime()) / 1000)) : 
        null,
      stats: {
        totalOffers: trade.tradeOffers.length,
        pendingOffers: trade.tradeOffers.filter(o => o.status === 'PENDING').length,
      },
      sender: {
        ...trade.sender,
        tradeSuccessRate: 0
      },
      // Only include offers if user is trade owner or has made an offer
      offers: trade.senderId === session.user.id 
        ? trade.tradeOffers 
        : trade.tradeOffers.filter(offer => offer.user.id === session.user.id),
    };

    return NextResponse.json({
      trade: enrichedTrade,
      userContext: {
        isOwner: enrichedTrade.isOwner,
        hasOffer: enrichedTrade.hasUserOffer,
        canMakeOffer: !enrichedTrade.isOwner && 
                      !enrichedTrade.hasUserOffer && 
                      trade.status === TradeStatus.PENDING
      }
    });

  } catch (error) {
    console.error("[GET_TRADE_DETAILS_ERROR]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error",
      { status: 500 }
    );
  }
} 