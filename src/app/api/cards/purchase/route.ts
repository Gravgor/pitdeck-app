import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { createActivity } from '@/lib/activity';
import { ActivityType } from '@prisma/client';
import { addXP } from "@/lib/levels";
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const { cardId } = await req.json();

    // Get the card and buyer's balance in a transaction
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: { owners: true, listing: true }
    });

    if (!card) {
      return NextResponse.json({ message: 'Card not found' }, { status: 404 });
    }

    if (!card.isForSale) {
      return NextResponse.json({ message: 'Card is not for sale' }, { status: 400 });
    }

    const buyer = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!buyer) {
      return NextResponse.json({ message: 'Buyer not found' }, { status: 404 });
    }

    const price = card.listing?.price ?? 0;

    if (buyer.coins && buyer.coins < price) {
      console.log(buyer.coins, card.listing?.price);
      return NextResponse.json({ message: 'Insufficient balance' }, { status: 400 });
    }

    // Perform the purchase transaction
    const [updatedCard, updatedBuyer, updatedSeller] = await prisma.$transaction([
      // Update card ownership
      prisma.card.update({
        where: { id: cardId },
        data: {
          owners: {
            connect: { id: session.user.id },
            disconnect: { id: card.owners[0].id }
          },
          isForSale: false,
          listing: {
            delete: true
          }
        }
      }),
      // Deduct balance from buyer
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          coins: {
            decrement: price
          }
        }
      }),
      // Add balance to seller
      prisma.user.update({
        where: { id: card.owners[0].id },
        data: {
          coins: {
            increment: price
          }
        }
      })
    ]);
    await createActivity(buyer.id, ActivityType.TRADE, `Purchased ${card.name}`, { card });
    await createActivity(updatedSeller.id, ActivityType.TRADE, `Sold ${card.name}`, { card });
    await addXP(buyer.id, 10);
    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json(
      { message: 'Failed to process purchase' }, 
      { status: 500 }
    );
  }
} 