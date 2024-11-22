//@ts-nocheck
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { withAuth } from '@/middleware/api';
import { apiCache } from '@/lib/cache';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (session) => {
    const { id } = params;
    const cacheKey = `user-data:${id}`;
    const cached = apiCache.get(cacheKey);

    if (cached) {
      return NextResponse.json(cached);
    }

    const userData = await prisma.user.findUnique({
      where: { id },
      select: {
        coins: true,
        cards: {
          take: 20,
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
          where: { status: "ACTIVE" },
          take: 10,
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

    if (userData) {
      apiCache.set(cacheKey, userData, { ttl: 1000 * 60 }); // 1 minute cache
    }

    return NextResponse.json(userData);
  });
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