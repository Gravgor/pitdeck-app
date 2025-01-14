import { prisma } from "../prisma";

export class DropsQueryService {
  static async getDropsNearUser({
    userLatitude,
    userLongitude,
    radius,
    userId
  }: {
    userLatitude: number;
    userLongitude: number;
    radius: number;
    userId: string;
  }) {
    const drops = await prisma.drop.findMany({
      where: {
        AND: [
          {
            latitude: {
              gte: userLatitude - radius / 111000,
              lte: userLatitude + radius / 111000,
            },
            longitude: {
              gte: userLongitude - radius / (111000 * Math.cos(userLatitude * (Math.PI / 180))),
              lte: userLongitude + radius / (111000 * Math.cos(userLatitude * (Math.PI / 180))),
            },
            expiresAt: {
              gt: new Date(),
            },
            isActive: true,
          },
          {
            OR: [
              { userId: userId }, // User's own drops
              { userId: null }    // Global drops (if any)
            ]
          }
        ]
      },
      include: {
        rewards: {
          include: {
            card: true,
          },
        },
      },
    });

    return drops;
  }
} 