import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { receiverId, cardIds, coinsOffered, message } = await req.json();

    const trade = await prisma.trade.create({
      data: {
        senderId: session.user.id,
        receiverId,
        coinsOffered,
        message,
        status: "PENDING",
        cards: {
          connect: cardIds.map((id: string) => ({ id })),
        },
      },
    });

    return NextResponse.json(trade);
  } catch (error) {
    return NextResponse.json({ error: "Error creating trade" }, { status: 500 });
  }
} 