import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { packId, selectedCardIds } = await request.json();

    // Get the pack opening session
    const openingSession = await prisma.packOpeningSession.findFirst({
      where: {
        userId: session.user.id,
        packId,
        expiresAt: { gt: new Date() }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!openingSession) {
      return new NextResponse("Pack opening session expired or not found", { status: 400 });
    }

    if (selectedCardIds.length !== openingSession.cardsToSelect) {
      return new NextResponse("Invalid number of cards selected", { status: 400 });
    }

    // Get pack details
    const pack = await prisma.pack.findUnique({
      where: { id: packId }
    });

    if (!pack) {
      return new NextResponse("Pack not found", { status: 404 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: session.user.id },
        data: { 
          coins: { decrement: pack.price },
          packPurchased: { increment: 1 }
        }
      });

      for (const cardId of selectedCardIds) {
        await tx.card.update({
          where: { id: cardId },
          data: {
            owners: {
              connect: { id: session.user.id }
            }
          }
        });
      }

      await tx.packOpeningSession.delete({
        where: { id: openingSession.id }
      });

      return { updatedUser };
    }, {
      timeout: 10000
    });

    const userCards = await prisma.card.findMany({
      where: {
        id: { in: selectedCardIds },
        owners: {
          some: { id: session.user.id }
        }
      },
      include: {
        owners: {
          where: { id: session.user.id }
        }
      }
    });

    return NextResponse.json({
      success: true,
      cards: userCards,
      newBalance: result.updatedUser.coins
    });

  } catch (error) {
    console.error("[PACK_OPEN_ERROR]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error", 
      { status: 500 }
    );
  }
}