import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TradeOfferStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status") || "all"; // all, pending, accepted, rejected

    const skip = (page - 1) * limit;

    const baseWhere = {
      userId: session.user.id,
    };

    // Add status filter if specified
    const where = {
        ...baseWhere,
        ...(status !== "all" && { 
          status: status.toUpperCase() as TradeOfferStatus 
        })
      };
    const [offers, total] = await prisma.$transaction([
      prisma.tradeOffer.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit,
        include: {
          trade: {
            include: {
              sender: {
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
              },
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
          },
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            }
          }
        }
      }),
      prisma.tradeOffer.count({ where })
    ]);

    // Enrich the data
    const enrichedOffers = offers.map(offer => ({
      ...offer,
      trade: {
        ...offer.trade,
        sender: {
          ...offer.trade.sender,
          tradeSuccessRate: 0
        }
      },
      timeElapsed: Date.now() - new Date(offer.createdAt).getTime(),
    }));

    return NextResponse.json({
      offers: enrichedOffers,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page
      }
    });

  } catch (error) {
    console.error("[GET_SENT_OFFERS_ERROR]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error",
      { status: 500 }
    );
  }
} 