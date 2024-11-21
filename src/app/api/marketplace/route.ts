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

    const { cardId, price } = await req.json();

    const listing = await prisma.listing.create({
      data: {
        cardId,
        price,
        sellerId: session.user.id,
        status: "ACTIVE",
      },
    });

    return NextResponse.json(listing);
  } catch (error) {
    return NextResponse.json({ error: "Error creating listing" }, { status: 500 });
  }
} 