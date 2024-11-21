//@ts-nocheck
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.id !== id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        coins: true,
        cards: {
          select: {
            id: true,
            name: true,
            type: true,
            rarity: true,
            imageUrl: true,
            serialNumber: true,
          },
        },
        listings: {
          where: {
            status: "ACTIVE",
          },
          select: {
            id: true,
            price: true,
            status: true,
            cardId: true,
          },
        },
        _count: {
          select: {
            cards: true,
            sentTrades: true,
            receivedTrades: true,
            packsPurchased: true,
          },
        },
      },
    });

    return NextResponse.json(userData);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching user data" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    if (!session?.user || session.user.id !== id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const username = formData.get("username") as string;
    const image = formData.get("image") as File | null;

    // Handle image upload if provided
    let imageUrl = undefined;
    if (image) {
      // Implement your image upload logic here
      // imageUrl = await uploadImage(image);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        username,
        ...(imageUrl && { image: imageUrl }),
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating user" },
      { status: 500 }
    );
  }
} 