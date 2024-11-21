//@ts-nocheck
import { prisma } from "../prisma";
import { Drop, Circuit, Event, Rarity, DropType, User, Prisma } from "@prisma/client";

interface GetDropsOptions {
  userLatitude: number;
  userLongitude: number;
  radius?: number;
  includeExpired?: boolean;
  includeCircuits?: boolean;
  includeEvents?: boolean;
}

interface ExtendedDrop extends Drop {
  circuit?: Circuit & {
    events: Event[];
  };
  distance?: number;
}

interface DropGenerationConfig {
  baseDropRate: number;
  circuitMultiplier: number;
  eventMultiplier: number;
  rarityDistribution: {
    COMMON: number;
    RARE: number;
    EPIC: number;
    LEGENDARY: number;
  };
  dropRadius: {
    CIRCUIT: number;
    WORLD: number;
    EVENT: number;
  };
  expirationTime: {
    STANDARD: number;
    CIRCUIT: number;
    EVENT: number;
  };
  maxDrops: {
    CIRCUIT: number;
    WORLD: number;
    EVENT: number;
  };
  pickupRadius: number; // meters
  rewardMultiplier: {
    COMMON: number;
    RARE: number;
    EPIC: number;
    LEGENDARY: number;
  };
}

const DEFAULT_CONFIG: DropGenerationConfig = {
  baseDropRate: 0.1,
  circuitMultiplier: 2.0,
  eventMultiplier: 3.0,
  rarityDistribution: {
    COMMON: 70,
    RARE: 20,
    EPIC: 8,
    LEGENDARY: 2,
  },
  dropRadius: {
    CIRCUIT: 5,
    WORLD: 50,
    EVENT: 10,
  },
  expirationTime: {
    STANDARD: 12,
    CIRCUIT: 24,
    EVENT: 48,
  },
  maxDrops: {
    CIRCUIT: 10,
    WORLD: 100,
    EVENT: 20,
  },
  pickupRadius: 100, // 100 meters
  rewardMultiplier: {
    COMMON: 1,
    RARE: 2,
    EPIC: 5,
    LEGENDARY: 10,
  },
};

export class DropService {
    static async generateAllDrops() {
        await this.cleanupExpiredDrops();
        await this.generateWorldDrops();
        await this.generateCircuitDrops();
        await this.generateEventDrops();
      }
    
      static async cleanupExpiredDrops() {
        await prisma.drop.deleteMany({
          where: {
            expiresAt: {
              lt: new Date(),
            },
          },
        });
      }
    
      static async generateWorldDrops() {
        const dropCount = Math.floor(Math.random() * DEFAULT_CONFIG.maxDrops.WORLD);
    
        const drops = Array.from({ length: dropCount }, () => {
          const rarity = this.determineRarity();
          const location = this.generateRandomWorldLocation();
    
          return {
            type: DropType.STANDARD,
            rarity,
            latitude: location.latitude,
            longitude: location.longitude,
            expiresAt: new Date(
              Date.now() + DEFAULT_CONFIG.expirationTime.STANDARD * 60 * 60 * 1000
            ),
            isActive: true,
          };
        });
    
        await prisma.drop.createMany({ data: drops });
      }
    
      static async generateCircuitDrops() {
        const circuits = await prisma.circuit.findMany();
    
        for (const circuit of circuits) {
          const dropCount = Math.floor(
            Math.random() * DEFAULT_CONFIG.maxDrops.CIRCUIT * DEFAULT_CONFIG.circuitMultiplier
          );
    
          const drops = Array.from({ length: dropCount }, () => {
            const rarity = this.determineRarity();
            const location = this.generateLocationNearCircuit(
              circuit.latitude,
              circuit.longitude,
              DEFAULT_CONFIG.dropRadius.CIRCUIT
            );
    
            return {
              type: DropType.CIRCUIT,
              rarity,
              latitude: location.latitude,
              longitude: location.longitude,
              circuitId: circuit.id,
              expiresAt: new Date(
                Date.now() + DEFAULT_CONFIG.expirationTime.CIRCUIT * 60 * 60 * 1000
              ),
              isActive: true,
            };
          });
    
          await prisma.drop.createMany({ data: drops });
        }
      }
    
      static async generateEventDrops() {
        const activeEvents = await prisma.event.findMany({
          where: {
            startDate: { lte: new Date() },
            endDate: { gte: new Date() },
          },
          include: { circuit: true },
        });
    
        for (const event of activeEvents) {
          const dropCount = Math.floor(
            Math.random() * DEFAULT_CONFIG.maxDrops.EVENT * DEFAULT_CONFIG.eventMultiplier
          );
    
          const drops = Array.from({ length: dropCount }, () => {
            const rarity = this.determineRarity();
            const location = this.generateLocationNearCircuit(
              event.circuit.latitude,
              event.circuit.longitude,
              DEFAULT_CONFIG.dropRadius.EVENT
            );
    
            return {
              type: DropType.EVENT,
              rarity,
              latitude: location.latitude,
              longitude: location.longitude,
              circuitId: event.circuit.id,
              expiresAt: new Date(
                Date.now() + DEFAULT_CONFIG.expirationTime.EVENT * 60 * 60 * 1000
              ),
              isActive: true,
            };
          });
    
          await prisma.drop.createMany({ data: drops });
        }
      }
      static async getDrops({
        userLatitude,
        userLongitude,
        radius = 10,
        includeExpired = false,
        includeCircuits = true,
        includeEvents = true,
      }: GetDropsOptions) {
        const radiusInDegrees = radius / 111.32;
    
        const whereConditions: Prisma.DropWhereInput = {
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
            {
              isActive: true,
            },
          ],
        };
    
        if (!includeExpired) {
            // @ts-ignore
          whereConditions.AND.push({
            expiresAt: {
              gt: new Date(),
            },
          });
        }
    
        const drops = await prisma.drop.findMany({
          where: whereConditions,
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
    
        const dropsWithDistance = drops.map((drop) => ({
          ...drop,
          distance: this.calculateDistance(
            userLatitude,
            userLongitude,
            drop.latitude,
            drop.longitude
          ),
        }));
    
        // @ts-ignore
        return this.sortDropsByPriority(dropsWithDistance);
      }
    
      static async pickupDrop(dropId: string, userId: string) {
        const [drop, user] = await Promise.all([
          prisma.drop.findUnique({
            where: { id: dropId },
            include: { circuit: true },
          }),
          prisma.user.findUnique({
            where: { id: userId },
            include: { lastLocation: true },
          }),
        ]);
    
        if (!drop || !user || !user.lastLocation) {
          throw new Error('Drop or user not found');
        }
    
        // Check if drop is still active
        if (!drop.isActive || drop.expiresAt < new Date()) {
          throw new Error('Drop has expired');
        }
    
        // Check if user is within pickup radius
        const distance = this.calculateDistance(
          user.lastLocation.latitude,
          user.lastLocation.longitude,
          drop.latitude,
          drop.longitude
        );
    
        if (distance * 1000 > DEFAULT_CONFIG.pickupRadius) {
          throw new Error('Too far from drop');
        }
    
        // Calculate rewards
        const baseReward = 100; // Base coins reward
        const rewardMultiplier = DEFAULT_CONFIG.rewardMultiplier[drop.rarity];
        const totalReward = baseReward * rewardMultiplier;
    
        // Generate random card based on drop type and rarity
        const card = await this.generateCardFromDrop(drop);
    
        // Update everything in a transaction
        return prisma.$transaction(async (tx) => {
          // Mark drop as collected
          await tx.drop.update({
            where: { id: dropId },
            data: { isActive: false },
          });
    
          // Update user's coins and add card to collection
          await tx.user.update({
            where: { id: userId },
            data: {
              coins: { increment: totalReward },
              cards: { connect: { id: card.id } },
            },
          });
    
        
    
          return {
            card,
            coinsEarned: totalReward,
          };
        });
      }
      private static determineRarity(): Rarity {
        const rand = Math.random() * 100;
        const dist = DEFAULT_CONFIG.rarityDistribution;
    
        if (rand < dist.LEGENDARY) return "LEGENDARY";
        if (rand < dist.LEGENDARY + dist.EPIC) return "EPIC";
        if (rand < dist.LEGENDARY + dist.EPIC + dist.RARE) return "RARE";
        return "COMMON";
      }
    
      private static generateLocationNearCircuit(
        baseLat: number,
        baseLng: number,
        radiusKm: number
      ) {
        const radiusDegrees = radiusKm / 111.32;
        const u = Math.random();
        const v = Math.random();
        const w = radiusDegrees * Math.sqrt(u);
        const t = 2 * Math.PI * v;
        const x = w * Math.cos(t);
        const y = w * Math.sin(t);
    
        return {
          latitude: baseLat + x,
          longitude: baseLng + y,
        };
      }
    
      private static generateRandomWorldLocation() {
        return {
          latitude: (Math.random() * 180) - 90,
          longitude: (Math.random() * 360) - 180,
        };
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
    
      private static sortDropsByPriority(drops: ExtendedDrop[]) {
        return drops.sort((a, b) => {
          const rarityOrder = {
            LEGENDARY: 0,
            EPIC: 1,
            RARE: 2,
            COMMON: 3,
          };
    
          // First, sort by rarity
          const rarityDiff = rarityOrder[a.rarity] - rarityOrder[b.rarity];
          if (rarityDiff !== 0) return rarityDiff;
    
          // Then by distance
          return (a.distance || 0) - (b.distance || 0);
        });
      }
    
      private static async generateCardFromDrop(drop: Drop) {
        // Implement card generation logic based on drop type and rarity
        // This would connect to your card generation service
        return prisma.card.create({
          data: {
            // Add your card generation logic here
          },
        });
      }
    }