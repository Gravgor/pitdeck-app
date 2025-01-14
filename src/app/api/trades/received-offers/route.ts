import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TradeStatus, TradeOfferStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status") || "all";

    const skip = (page - 1) * limit;

    // Find trades created by the user
    const trades = await prisma.trade.findMany({
      where: {
        senderId: session.user.id,
        status: TradeStatus.PENDING,
      },
      include: {
        tradeOffers: {
          where: {
            ...(status !== "all" && { 
              status: status.toUpperCase() as TradeOfferStatus 
            })
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              }
            },
            offeredCards: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                rarity: true,
                type: true,
                description: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        offeredCards: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
            rarity: true,
            type: true,
            description: true,
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const total = await prisma.trade.count({
      where: {
        senderId: session.user.id,
        status: TradeStatus.PENDING,
      }
    });

    // Enrich the data
    const enrichedTrades = trades.map(trade => ({
      ...trade,
      tradeOffers: trade.tradeOffers.map(offer => ({
        ...offer,
        user: {
          ...offer.user,
          tradeSuccessRate: 0
        },
        timeElapsed: Date.now() - new Date(offer.createdAt).getTime(),
      }))
    }));

    return NextResponse.json({
      trades: enrichedTrades,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page
      },
      timestamp: Date.now()
    });

  } catch (error) {
    console.error("[GET_RECEIVED_OFFERS_ERROR]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error",
      { status: 500 }
    );
  }
} 