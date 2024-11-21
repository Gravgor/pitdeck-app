import { prisma } from "./prisma";

export async function getUserByUsername(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { name: username },
      select: {
        id: true,
        name:  true,
        image: true,
        coins: true,
        totalXp: true,
        cards: {
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