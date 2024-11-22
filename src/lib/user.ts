import { prisma } from "./prisma";
import { apiCache } from "./cache";

export async function getUserByUsername(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { name: username },
      select: {
        id: true,
        name: true,
        image: true,
        coins: true,
        totalXp: true,
        cards: {
          take: 20, // Limit initial load
          orderBy: { createdAt: 'desc' },
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

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
} 