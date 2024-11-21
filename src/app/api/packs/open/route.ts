import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generatePack } from "@/lib/packs";
import { createActivity } from "@/lib/activity";
import { addXP } from "@/lib/levels";
import { ActivityType } from "@prisma/client";
import { createNotification } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { packId } = await req.json();

    // Get pack and user
    const [pack, user] = await Promise.all([
      prisma.pack.findUnique({ where: { id: packId } }),
      prisma.user.findUnique({ where: { id: session.user.id } }),
    ]);

    if (!pack || !user) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Check if user has enough coins
    if (user.coins < pack.price) {
      return NextResponse.json(
        { error: "Insufficient funds" },
        { status: 400 }
      );
    }

    // Generate pack contents
    const cardIds = await generatePack(packId);

    // Update user's collection and coins in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Deduct coins
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          coins: user.coins - pack.price,
          cards: {
            connect: cardIds.map((id) => ({ id })),
          },
        },
      });

      // Get the cards details
      const cards = await tx.card.findMany({
        where: { id: { in: cardIds } },
      });
      await createActivity(user.id, ActivityType.PACK_OPENED, `Opened pack ${pack.name}`, { cards });
      //await addXP(user.id, 10);
      return { user: updatedUser, cards };
    });
    console.log(cardIds);


    return NextResponse.json(result);
  } catch (error) {
    console.error("Pack opening error:", error);
    return NextResponse.json(
      { error: "Error opening pack" },
      { status: 500 }
    );
  }
}