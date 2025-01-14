import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TradeStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const filter = searchParams.get("filter") || "all"; // all, mine, open
    const sort = searchParams.get("sort") || "recent"; // recent, oldest, coins

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Base query
    const baseWhere = {
      status: TradeStatus.PENDING,
      expiresAt: {
        gt: new Date()
      }
    };

    // Apply filters
    const where = {
      ...baseWhere,
      ...(filter === "mine" && {
        senderId: session.user.id
      }),
      ...(filter === "open" && {
        isOpenTrade: true,
        senderId: {
          not: session.user.id
        }
      })
    };

    // Apply sorting
    const orderBy = {
      ...(sort === "recent" && { createdAt: "desc" }),
      ...(sort === "oldest" && { createdAt: "asc" }),
      ...(sort === "coins" && { coinsOffered: "desc" })
    };

    // Get trades with pagination
    const [trades, total] = await prisma.$transaction([
      prisma.trade.findMany({
        where,
        skip,
        take: limit,
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              image: true
            }
          },
          offeredCards: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
              rarity: true
            }
          },
          tradeOffers: {
            select: {
              id: true,
              userId: true,
              status: true
            }
          },
          _count: {
            select: {
              tradeOffers: true
            }
          }
        }
      }),
      prisma.trade.count({ where })
    ]);

    // Transform trades to include additional info
    const enrichedTrades = trades.map(trade => ({
      ...trade,
      isOwner: trade.senderId === session.user.id,
      hasUserOffer: trade.tradeOffers?.some(offer => 
        offer.userId === session.user.id
      ),
      offersCount: trade._count?.tradeOffers
    }));

    return NextResponse.json({
      trades: enrichedTrades,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit
      },
      filters: {
        current: filter,
        available: ["all", "mine", "open"]
      },
      sorting: {
        current: sort,
        available: ["recent", "oldest", "coins"]
      }
    });

  } catch (error) {
    console.error("[GET_TRADES_ERROR]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error",
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { cardIds, coins, note, isOpenTrade = true } = await request.json();

    // Validate input
    if (!Array.isArray(cardIds) || cardIds.length === 0) {
      return new NextResponse("Must offer at least one card", { status: 400 });
    }

    if (typeof coins !== 'number' || coins < 0) {
      return new NextResponse("Invalid coins amount", { status: 400 });
    }

    // Verify user owns all cards
    const userCards = await prisma.card.findMany({
      where: {
        id: { in: cardIds },
        owners: {
          some: { id: session.user.id }
        }
      }
    });

    if (userCards.length !== cardIds.length) {
      return new NextResponse("You don't own all selected cards", { status: 400 });
    }

    // Verify user has enough coins
    if (coins > 0) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { coins: true }
      });

      if (!user || user.coins < coins) {
        return new NextResponse("Insufficient coins", { status: 400 });
      }
    }

    // Set expiration (48 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    // Create trade in transaction
    const trade = await prisma.$transaction(async (tx) => {
      const newTrade = await tx.trade.create({
        data: {
          senderId: session.user.id,
          coinsOffered: coins,
          note: note || undefined,
          status: TradeStatus.PENDING,
          isOpenTrade,
          expiresAt,
          offeredCards: {
            connect: cardIds.map(id => ({ id }))
          }
        },
        include: {
          sender: true,
          offeredCards: true
        }
      });

      // Lock coins if offering any
      if (coins > 0) {
        await tx.user.update({
          where: { id: session.user.id },
          data: { coins: { decrement: coins } }
        });
      }

      return newTrade;
    });

    return NextResponse.json({
      success: true,
      trade
    });

  } catch (error) {
    console.error("[CREATE_TRADE_ERROR]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error",
      { status: 500 }
    );
  }
} 