import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TradeStatus, TradeOfferStatus } from "@prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; offerId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { action } = await request.json();
    const { id, offerId } = await params;

    if (!['accept', 'reject'].includes(action)) {
      return new NextResponse("Invalid action", { status: 400 });
    }

    // Get trade and offer details
    const trade = await prisma.trade.findUnique({
      where: { id },
      include: {
        sender: true,
        offeredCards: true,
        tradeOffers: {
          where: { id: offerId },
          include: {
            user: true,
            offeredCards: true,
          }
        }
      }
    });

    if (!trade) {
      return new NextResponse("Trade not found", { status: 404 });
    }

    const offer = trade.tradeOffers[0];
    if (!offer) {
      return new NextResponse("Offer not found", { status: 404 });
    }

    if (trade.senderId !== session.user.id) {
      return new NextResponse("Not authorized to manage this trade", { status: 403 });
    }

    if (trade.status !== TradeStatus.PENDING) {
      return new NextResponse("Trade is no longer active", { status: 400 });
    }

    if (offer.status !== TradeOfferStatus.PENDING) {
      return new NextResponse("Offer is no longer pending", { status: 400 });
    }

    if (action === 'accept') {
      // Handle trade acceptance in a transaction
      await prisma.$transaction(async (tx) => {
        // Update offer status
        await tx.tradeOffer.update({
          where: { id: offer.id },
          data: { status: TradeOfferStatus.ACCEPTED }
        });

        // Update trade status
        await tx.trade.update({
          where: { id: trade.id },
          data: { status: TradeStatus.ACCEPTED }
        });

        // Transfer offered cards from sender to receiver
        for (const card of trade.offeredCards) {
          await tx.card.update({
            where: { id: card.id },
            data: {
              owners: {
                disconnect: { id: trade.senderId },
                connect: { id: offer.userId }
              }
            }
          });
        }

        // Transfer offered cards from receiver to sender
        for (const card of offer.offeredCards) {
          await tx.card.update({
            where: { id: card.id },
            data: {
              owners: {
                disconnect: { id: offer.userId },
                connect: { id: trade.senderId }
              }
            }
          });
        }

        // Handle coin transfers
        if (trade.coinsOffered > 0) {
          await tx.user.update({
            where: { id: offer.userId },
            data: { coins: { increment: trade.coinsOffered } }
          });
        }

        if (offer.coins > 0) {
          await tx.user.update({
            where: { id: trade.senderId },
            data: { coins: { increment: offer.coins } }
          });
        }

        // Update trade statistics
       /* await tx.user.update({
          where: { id: trade.senderId },
          data: {
            totalTrades: { increment: 1 },
            successfulTrades: { increment: 1 }
          }
        });

        await tx.user.update({
          where: { id: offer.userId },
          data: {
            totalTrades: { increment: 1 },
            successfulTrades: { increment: 1 }
          }
        });*/

        // Reject all other offers
        await tx.tradeOffer.updateMany({
          where: {
            tradeId: trade.id,
            id: { not: offer.id },
            status: TradeOfferStatus.PENDING
          },
          data: { status: TradeOfferStatus.REJECTED }
        });

        // Create notifications
        await tx.notification.createMany({
          data: [
            {
              userId: trade.senderId,
              type: 'TRADE_ACCEPTED',
              message: `Your trade with ${offer.user.name} has been accepted`,
              metadata: { tradeId: trade.id }
            },
            {
              userId: offer.userId,
              type: 'TRADE_ACCEPTED',
              message: `Your offer for ${trade.sender.name}'s trade has been accepted`,
              metadata: { tradeId: trade.id }
            }
          ]
        });
      });
    } else {
      // Handle offer rejection
      await prisma.$transaction(async (tx) => {
        // Update offer status
        await tx.tradeOffer.update({
          where: { id: offer.id },
          data: { status: TradeOfferStatus.REJECTED }
        });

        // Return coins to offerer if any were offered
        if (offer.coins > 0) {
          await tx.user.update({
            where: { id: offer.userId },
            data: { coins: { increment: offer.coins } }
          });
        }

        // Create notification
        await tx.notification.create({
          data: {
            userId: offer.userId,
            type: 'TRADE_OFFER',
            message: `Your offer for ${trade.sender.name}'s trade was rejected`,
            metadata: { tradeId: trade.id }
          }
        });
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("[TRADE_OFFER_ACTION_ERROR]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error",
      { status: 500 }
    );
  }
} 