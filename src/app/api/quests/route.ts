import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const quests = await prisma.quest.findMany({
      where: {
        OR: [
          {
            participants: {
              some: {
                userId: session.user.id,
                status: {
                  in: ['IN_PROGRESS', 'COMPLETED']
                }
              }
            }
          },
          {
            status: 'ACTIVE',
            participants: {
              none: {
                userId: session.user.id
              }
            }
          }
        ]
      },
      include: {
        rewardCards: {
          include: {
            card: true
          }
        },
        participants: {
          where: {
            userId: session.user.id
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(quests);
  } catch (error) {
    console.error("[QUESTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 