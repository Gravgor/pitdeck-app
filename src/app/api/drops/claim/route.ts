import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { dropId, latitude, longitude } = await request.json();

    // Get the drop
    const drop = await prisma.drop.findUnique({
      where: { id: dropId },
      include: { rewards: true }
    });

    if (!drop) {
      return new NextResponse("Drop not found", { status: 404 });
    }

    // Check if drop is still active
    if (!drop.isActive || new Date() > drop.expiresAt) {
      return new NextResponse("Drop is no longer available", { status: 400 });
    }

    // Check distance
    const distance = calculateDistance(
      latitude,
      longitude,
      drop.latitude,
      drop.longitude
    );

    const maxDistance = 100; // meters
    if (distance > maxDistance) {
      return new NextResponse("Too far from drop", { status: 400 });
    }

    // Process rewards
    await prisma.$transaction(async (tx) => {
      // Deactivate drop
      await tx.drop.update({
        where: { id: dropId },
        data: { isActive: false }
      });

      // Process each reward
      for (const reward of drop.rewards) {
        switch (reward.type) {
          case 'CARD':
            if (reward.cardId) {
              // Update card ownership
              await tx.card.update({
                where: { id: reward.cardId },
                data: {
                  owners: {
                    connect: {
                      id: session.user.id
                    }
                  }
                }
              });
            }
            break;
          case 'COINS':
            await tx.user.update({
              where: { id: session.user.id },
              data: {
                coins: { increment: reward.amount }
              }
            });
            break;
         /* case 'PACK':
            await tx.userPack.create({
              data: {
                userId: session.user.id,
                amount: reward.amount
              }
            });
            break;*/
        }
      }

      /* Record the claim
      await tx.dropClaim.create({
        data: {
          dropId: drop.id,
          userId: session.user.id,
          latitude,
          longitude
        }
      });*/
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CLAIM_DROP_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }