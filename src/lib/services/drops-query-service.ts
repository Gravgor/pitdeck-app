import { prisma } from "../prisma";

export class DropsQueryService {
  static async getDropsNearUser({
    userLatitude,
    userLongitude,
    radius = 10,
  }: { userLatitude: number; userLongitude: number; radius: number }) {
    const radiusInDegrees = radius / 111.32;

    const drops = await prisma.drop.findMany({
      where: {
        AND: [
          {
            latitude: {
              gte: userLatitude - radiusInDegrees,
              lte: userLatitude + radiusInDegrees,
            },
          },
          {
            longitude: {
              gte: userLongitude - radiusInDegrees,
              lte: userLongitude + radiusInDegrees,
            },
          },
          { isActive: true },
          { expiresAt: { gt: new Date() } }
        ],
      },
      include: {
        circuit: {
          include: {
            events: {
              where: {
                startDate: { lte: new Date() },
                endDate: { gte: new Date() },
              },
            },
          },
        },
      },
    });

    return drops.map(drop => ({
      ...drop,
      distance: this.calculateDistance(
        userLatitude,
        userLongitude,
        drop.latitude,
        drop.longitude
      ),
    })).sort((a, b) => a.distance - b.distance);
  }

  private static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
} 