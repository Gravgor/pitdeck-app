import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { createActivity } from '@/lib/activity';
import { ActivityType } from '@prisma/client';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const trade = await prisma.trade.findUnique({
      where: { id: params.id },
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
      }
    });

    if (!trade) {
      return NextResponse.json({ error: "Trade not found" }, { status: 404 });
    }

    return NextResponse.json(trade);
  } catch (error) {
    console.error('Error fetching trade:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action } = await req.json();
    const tradeId = params.id;

    const trade = await prisma.trade.findUnique({
      where: { id: tradeId },
      include: {
        sender: true,
        receiver: true,
        offeredCards: true,
        requestedCards: true,
      }
    });

    if (!trade) {
      return NextResponse.json({ error: "Trade not found" }, { status: 404 });
    }

    if (trade.receiverId !== session.user.id) {
      return NextResponse.json({ error: "Not authorized to respond to this trade" }, { status: 403 });
    }

    if (trade.status !== 'PENDING') {
      return NextResponse.json({ error: "Trade is no longer pending" }, { status: 400 });
    }

    if (action === 'REJECT') {
      const updatedTrade = await prisma.trade.update({
        where: { id: tradeId },
        data: { status: 'REJECTED' }
      });

      await Promise.all([
        createActivity(
          trade.senderId,
          ActivityType.TRADE,
          `Trade rejected by ${trade.receiver.name}`,
          { trade }
        ),
        createActivity(
          trade.receiverId,
          ActivityType.TRADE,
          `Rejected trade from ${trade.sender.name}`,
          { trade }
        )
      ]);

      return NextResponse.json(updatedTrade);
    }

    // Handle acceptance
    const updatedTrade = await prisma.$transaction(async (tx) => {
      // Transfer cards
      const cardUpdates = [
        ...trade.offeredCards.map(card => 
          tx.card.update({
            where: { id: card.id },
            data: {
              owners: {
                disconnect: { id: trade.senderId },
                connect: { id: trade.receiverId }
              }
            }
          })
        ),
        ...trade.requestedCards.map(card => 
          tx.card.update({
            where: { id: card.id },
            data: {
              owners: {
                disconnect: { id: trade.receiverId },
                connect: { id: trade.senderId }
              }
            }
          })
        )
      ];

      // Handle coins
      const userUpdates = [];
      if (trade.coinsOffered > 0) {
        userUpdates.push(
          tx.user.update({
            where: { id: trade.senderId },
            data: { coins: { decrement: trade.coinsOffered } }
          }),
          tx.user.update({
            where: { id: trade.receiverId },
            data: { coins: { increment: trade.coinsOffered } }
          })
        );
      }

      // Update trade status
      const completedTrade = await tx.trade.update({
        where: { id: tradeId },
        data: { status: 'COMPLETED' }
      });

      await Promise.all([...cardUpdates, ...userUpdates]);

      return completedTrade;
    });

    // Create activities
    await Promise.all([
      createActivity(
        trade.senderId,
        ActivityType.TRADE,
        `Trade accepted by ${trade.receiver.name}`,
        { trade: updatedTrade }
      ),
      createActivity(
        trade.receiverId,
        ActivityType.TRADE,
        `Accepted trade from ${trade.sender.name}`,
        { trade: updatedTrade }
      )
    ]);

    return NextResponse.json(updatedTrade);
  } catch (error) {
    console.error('Error responding to trade:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}