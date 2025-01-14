//@ts-nocheck
import { prisma } from "@/lib/prisma";
import { Drop, Circuit, Event, Rarity, DropType } from "@prisma/client";
import { DropGenerator } from "@/services/dropGeneration/generator";
import { DEFAULT_CONFIG } from "@/services/dropGeneration/config";
import { DEVELOPMENT_CONFIG } from "@/services/dropGeneration/config";

const WORLD_CONFIG = {
  DROPS_PER_ACTIVE_AREA: 30,
  EXPIRATION_HOURS: 24,
  ACTIVE_USER_RADIUS: 5000, // 5km radius around active users
  ACTIVE_USER_TIMEFRAME: 15, // minutes
  MIN_DISTANCE_BETWEEN_AREAS: 10000, // 10km minimum between generation areas
};

export class DropService {
  private static generator: DropGenerator;

  private static getGenerator() {
    if (!this.generator) {
      const isDev = process.env.NODE_ENV === "development";
      this.generator = new DropGenerator(
        isDev ? DEVELOPMENT_CONFIG : DEFAULT_CONFIG
      );
    }
    return this.generator;
  }

  static async generateGlobalDrops() {
    await this.cleanupExpiredDrops();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingDrops = await prisma.drop.count({
      where: { createdAt: { gte: today } }
    });

    if (existingDrops > 0) {
      console.log('Drops already generated for today');
      return;
    }

    const generator = this.getGenerator();
    const expirationTime = new Date(
      Date.now() + WORLD_CONFIG.EXPIRATION_HOURS * 60 * 60 * 1000
    );

    // Get active user locations from the last 15 minutes
    const activeLocations = await prisma.userLocation.findMany({
      where: {
        updatedAt: {
          gte: new Date(Date.now() - WORLD_CONFIG.ACTIVE_USER_TIMEFRAME * 60000)
        }
      },
      select: {
        latitude: true,
        longitude: true
      }
    });

    console.log(`Found ${activeLocations.length} active user locations`);

    const generationAreas = this.groupNearbyLocations(activeLocations);
    console.log(`Grouped into ${generationAreas.length} generation areas`);

    for (const area of generationAreas) {
      console.log(`Generating drops around location: ${area.latitude}, ${area.longitude}`);
      
      await generator.generateDrops({
        latitude: area.latitude,
        longitude: area.longitude,
        radius: WORLD_CONFIG.ACTIVE_USER_RADIUS,
        count: WORLD_CONFIG.DROPS_PER_ACTIVE_AREA,
        expiresAt: expirationTime
      });
    }

    console.log('Global drops generation completed');
  }

  private static groupNearbyLocations(locations: { latitude: number; longitude: number }[]) {
    const groups: { latitude: number; longitude: number }[] = [];

    for (const location of locations) {
      const isFarEnough = groups.every(group => 
        this.calculateDistance(
          location.latitude,
          location.longitude,
          group.latitude,
          group.longitude
        ) * 1000 >= WORLD_CONFIG.MIN_DISTANCE_BETWEEN_AREAS
      );

      if (isFarEnough) {
        groups.push(location);
      }
    }

    return groups;
  }

  static async cleanupExpiredDrops() {
    await prisma.$transaction([
      prisma.reward.deleteMany({
        where: {
          drop: {
            expiresAt: {
              lt: new Date(),
            },
          },
        },
      }),
      prisma.drop.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
          rewards: {
            none: {},
          },
        },
      }),
    ]);
  }


  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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