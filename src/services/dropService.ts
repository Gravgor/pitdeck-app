import { prisma } from '@/lib/prisma';

interface Location {
  latitude: number;
  longitude: number;
}

export async function getNearbyDrops(userLocation: Location, radius: number, isPremium: boolean) {
  const actualRadius = Math.min(radius, 500000);

  // Convert meters to degrees (approximate)
  const metersToDegreesLat = actualRadius / 111320;
  const metersToDegreesLon = actualRadius / (111320 * Math.cos(userLocation.latitude * (Math.PI / 180)));

  return await prisma.drop.findMany({
    where: {
      AND: [
        {
          latitude: {
            gte: userLocation.latitude - metersToDegreesLat,
            lte: userLocation.latitude + metersToDegreesLat,
          },
        },
        {
          longitude: {
            gte: userLocation.longitude - metersToDegreesLon,
            lte: userLocation.longitude + metersToDegreesLon,
          },
        },
        {
          expiresAt: {
            gt: new Date(),
          },
          isActive: true,
        },
      ],
    },
    include: {
      rewards: true,
    },
  });
} 