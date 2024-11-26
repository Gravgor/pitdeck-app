import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { createActivity } from '@/lib/activity';
import { ActivityType } from '@prisma/client';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const trades = await prisma.trade.findMany({
      where: {
        OR: [
          { senderId: session.user.id },
          { receiverId: session.user.id }
        ],
        status: 'PENDING'
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
        offeredCards: true,
        requestedCards: true
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

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { receiverId, offeredCardIds, requestedCardIds, coinsOffered } = await req.json();

    // Verify receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId }
    });

    if (!receiver) {
      return NextResponse.json({ error: "Trade receiver not found" }, { status: 404 });
    }

    // Verify sender owns offered cards
    const offeredCards = await prisma.card.findMany({
      where: {
        id: { in: offeredCardIds },
        owners: { some: { id: session.user.id } }
      }
    });

    if (offeredCards.length !== offeredCardIds.length) {
      return NextResponse.json({ error: "You don't own all offered cards" }, { status: 400 });
    }

    // Verify receiver owns requested cards
    const requestedCards = await prisma.card.findMany({
      where: {
        id: { in: requestedCardIds },
        owners: { some: { id: receiverId } }
      }
    });

    if (requestedCards.length !== requestedCardIds.length) {
      return NextResponse.json({ error: "Receiver doesn't own all requested cards" }, { status: 400 });
    }

    // Check sender's coins if offering any
    if (coinsOffered > 0) {
      const sender = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { coins: true }
      });

      if (!sender || sender.coins < coinsOffered) {
        return NextResponse.json({ error: "Insufficient coins" }, { status: 400 });
      }
    }

    // Create trade
    const trade = await prisma.trade.create({
      data: {
        senderId: session.user.id,
        receiverId,
        coinsOffered: coinsOffered || 0,
        status: 'PENDING',
        offeredCards: {
          connect: offeredCardIds.map((id: string) => ({ id }))
        },
        requestedCards: {
          connect: requestedCardIds.map((id: string) => ({ id }))
        }
      },
      include: {
        offeredCards: true,
        requestedCards: true,
      }
    });

    // Create activities
    await Promise.all([
      createActivity(
        session.user.id,
        ActivityType.TRADE,
        `Sent trade offer to ${receiver.name}`,
        { trade }
      ),
      createActivity(
        receiverId,
        ActivityType.TRADE,
        `Received trade offer from ${session.user.name}`,
        { trade }
      )
    ]);

    return NextResponse.json(trade);
  } catch (error) {
    console.error('Error creating trade:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}