import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addXP } from "@/lib/levels";

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

    // Validate selection
    if (selectedCardIds.length !== openingSession.cardsToSelect) {
      return new NextResponse("Invalid number of cards selected", { status: 400 });
    }

    // Validate cards are from available set
    const invalidCards = selectedCardIds.filter(
      (id: any) => !openingSession.availableCardIds.includes(id)
    );

    if (invalidCards.length > 0) {
      return new NextResponse("Invalid card selection", { status: 400 });
    }

    // Get pack details
    const pack = await prisma.pack.findUnique({
      where: { id: packId }
    });

    if (!pack) {
      return new NextResponse("Pack not found", { status: 404 });
    }

    // Execute the transaction
    const result = await prisma.$transaction(async (tx) => {
      // Deduct coins
      const updatedUser = await tx.user.update({
        where: { id: session.user.id },
        data: { 
          coins: { decrement: pack.price },
          packPurchased: { increment: 1 }
        }
      });

      const userCards = await Promise.all(
        selectedCardIds.map((cardId: any) =>
          tx.card.update({
            where: { id: cardId },
            data: {
              owners: { connect: { id: session.user.id } }
            }
          })
        )
      );

      // Delete the opening session
      await tx.packOpeningSession.delete({
        where: { id: openingSession.id }
      });

      // Award XP
      await addXP(session.user.id, 100);

      return { userCards, updatedUser };
    });

    return NextResponse.json({
      success: true,
      userCards: result.userCards,
      newBalance: result.updatedUser.coins
    });

  } catch (error) {
    console.error("[PACK_OPEN_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}