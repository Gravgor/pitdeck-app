import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dropId = searchParams.get('dropId');

    if (!dropId) {
      return NextResponse.json({ error: "Drop ID is required" }, { status: 400 });
    }

    const drop = await prisma.drop.findUnique({
      where: { id: dropId },
      include: {
        rewards: {
          include: {
            card: true
          }
        }
      }
    });

    if (!drop) {
      return NextResponse.json({ error: "Drop not found" }, { status: 404 });
    }

    return NextResponse.json(drop);
  } catch (error) {
    console.error("[GET_DROP_CARDS_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch drop cards" },
      { status: 500 }
    );
  }
} 