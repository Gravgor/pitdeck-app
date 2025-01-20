import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generatePackCards } from "@/lib/packs";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { packId } = await request.json();

    // Validate pack exists and user has enough coins
    const pack = await prisma.pack.findUnique({
      where: { id: packId },
    });

    if (!pack) {
      return new NextResponse("Pack not found", { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (user.coins < pack.price) {
      return new NextResponse("Insufficient coins", { status: 400 });
    }

    // Generate available cards (more than needed to allow choice)
    const availableCards = await generatePackCards({
      packId,
      count: 10, // Always show 10 cards to choose from
      guaranteedRarities: pack.guaranteedRarities as string[] || [],
    });

    // Store the available cards in a temporary session
    await prisma.packOpeningSession.create({
      data: {
        userId: session.user.id,
        packId: pack.id,
        availableCardIds: availableCards.map(card => card.id),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiry
        guaranteedRarities: pack.guaranteedRarities as string[] || [],
        cardsToSelect: pack.cardsPerPack
      }
    });

    return NextResponse.json({ 
      cards: availableCards,
      config: {
        cardsToSelect: pack.cardsPerPack,
        guaranteedRarities: pack.guaranteedRarities
      }
    });

  } catch (error) {
    console.error("[PACK_REVEAL_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 