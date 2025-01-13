import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { createActivity } from '@/lib/activity';
import { ActivityType } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cardIds, coins, isOpenTrade = true } = await req.json();

    // Verify sender owns offered cards
    const offeredCards = await prisma.card.findMany({
      where: {
        id: { in: cardIds },
        owners: { some: { id: session.user.id } }
      }
    });

    if (offeredCards.length !== cardIds.length) {
      return NextResponse.json({ error: "You don't own all offered cards" }, { status: 400 });
    }

    // Check sender's coins if offering any
    if (coins > 0) {
      const sender = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { coins: true }
      });

      if (!sender || sender.coins < coins) {
        return NextResponse.json({ error: "Insufficient coins" }, { status: 400 });
      }
    }

    // Create market trade
    const trade = await prisma.trade.create({
      data: {
        senderId: session.user.id,
        coinsOffered: coins || 0,
        status: 'OPEN',
        isOpenTrade: true, // Always true for market trades
        offeredCards: {
          connect: cardIds.map((id: string) => ({ id }))
        }
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        offeredCards: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
            rarity: true
          }
        }
      }
    });

    // Create activity for market trade
    await createActivity(
      session.user.id,
      ActivityType.TRADE,
      `Listed ${offeredCards.length} card${offeredCards.length > 1 ? 's' : ''} on the market`,
      { trade }
    );

    return NextResponse.json(trade);
  } catch (error) {
    console.error('Error creating trade:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// New endpoint to claim an open trade
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tradeId, offeredCardIds } = await req.json();

    // Verify trade exists and is open
    const trade = await prisma.trade.findUnique({
      where: { 
        id: tradeId,
        status: 'OPEN',
        isOpenTrade: true
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true
          }
        },
        requestedCards: true
      }
    });

    if (!trade) {
      return NextResponse.json({ error: "Trade not found or not available" }, { status: 404 });
    }

    if (trade.sender.id === session.user.id) {
      return NextResponse.json({ error: "Cannot claim your own trade" }, { status: 400 });
    }

    // Verify claimer owns offered cards
    const claimerCards = await prisma.card.findMany({
      where: {
        id: { in: offeredCardIds },
        owners: { some: { id: session.user.id } }
      }
    });

    if (claimerCards.length !== offeredCardIds.length) {
      return NextResponse.json({ error: "You don't own all offered cards" }, { status: 400 });
    }

    // Update trade with claimer's information
    const updatedTrade = await prisma.trade.update({
      where: { id: tradeId },
      data: {
        receiverId: session.user.id,
        status: 'PENDING',
        receiverOfferedCards: {
          connect: offeredCardIds.map((id: string) => ({ id }))
        }
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true
          }
        },
        offeredCards: true,
        receiverOfferedCards: true
      }
    });

    // Create activities for both parties
    await Promise.all([
      createActivity(
        trade.sender.id,
        ActivityType.TRADE,
        `${session.user.name} has claimed your open trade`,
        { trade: updatedTrade }
      ),
      createActivity(
        session.user.id,
        ActivityType.TRADE,
        `Claimed open trade from ${trade.sender.name}`,
        { trade: updatedTrade }
      )
    ]);

    return NextResponse.json(updatedTrade);
  } catch (error) {
    console.error('Error claiming trade:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const trades = await prisma.trade.findMany({
      where: {
        isOpenTrade: true,
        status: 'OPEN'
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        offeredCards: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
            rarity: true
          }
        },
        requestedCards: {
          select: {
            id: true,
            name: true,
            rarity: true
          }
        },
        receiverOfferedCards: {
          select: {
            id: true,
            name: true,
            rarity: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(trades);
  } catch (error) {
    console.error('Error fetching trades:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}