import { prisma } from '@/lib/prisma';
import { DropGenerationConfig, DropTypeConfig, GenerationArea } from './types';
import { DEFAULT_CONFIG } from './config';
import { Drop, DropType, Rarity, RewardType, Prisma } from '@prisma/client';

export class DropGenerator {
  private config: DropGenerationConfig;
  private isDev: boolean;

  constructor(config: DropGenerationConfig = DEFAULT_CONFIG) {
    this.config = config;
    this.isDev = config.isDevelopment || false;
  }

  async generateDrops(area: GenerationArea) {
    const existingDrops = await this.getExistingDrops(area);
    const numDropsToGenerate = area.count;
    
    if (numDropsToGenerate <= 0) return;

    const dropsToCreate = [];
    for (let i = 0; i < numDropsToGenerate; i++) {
      const drop = await this.generateSingleDrop(area, existingDrops);
      if (drop) {
        dropsToCreate.push(drop);
      }
    }

    const createdDrops = await Promise.all(
      dropsToCreate.map(async (dropData) => {
        const { rewards, ...dropInfo } = dropData;
        const drop = await prisma.drop.create({
          data: {
            ...dropInfo,
            expiresAt: area.expiresAt,
            rewards: {
              create: rewards as Prisma.RewardCreateWithoutDropInput[]
            }
          },
          include: {
            rewards: true
          }
        });
        existingDrops.push(drop);
        return drop;
      })
    );

    return createdDrops;
  }

  private async getExistingDrops(area: GenerationArea) {
    return await prisma.drop.findMany({
      where: {
        latitude: {
          gte: area.latitude - area.radius / 111320,
          lte: area.latitude + area.radius / 111320
        },
        longitude: {
          gte: area.longitude - area.radius / (111320 * Math.cos(area.latitude * (Math.PI / 180))),
          lte: area.longitude + area.radius / (111320 * Math.cos(area.latitude * (Math.PI / 180)))
        },
        isActive: true
      }
    });
  }

  private calculateDropsNeeded(existingDrops: number): number {
    if (this.isDev && this.config.developmentConfig?.fixedDropCount) {
      return this.config.developmentConfig.fixedDropCount;
    }

    const { minDropsPerArea, maxDropsPerArea } = this.config;
    const targetDrops = Math.floor(Math.random() * (maxDropsPerArea - minDropsPerArea + 1)) + minDropsPerArea;
    return Math.max(0, targetDrops - existingDrops);
  }

  private async generateSingleDrop(area: GenerationArea, existingDrops: Drop[]) {
    const dropType = this.selectRandomDropType();
    const rarity = this.selectRandomRarity();
    const location = this.generateValidLocation(area, dropType, existingDrops);
    
    if (!location) return null;

    const rewards = await this.generateRewards(dropType);
    const respawnTime = this.isDev && this.config.developmentConfig?.shortRespawnTime
      ? this.config.developmentConfig.shortRespawnTime
      : this.config.respawnTimeMinutes;

    const expiresAt = new Date(Date.now() + respawnTime * 60000);
    const nearestCircuit = await this.getNearestCircuit(location.latitude, location.longitude);

    return {
      type: dropType.type as DropType,
      rarity: rarity as Rarity,
      latitude: location.latitude,
      longitude: location.longitude,
      circuitId: nearestCircuit?.id || null,
      isActive: true,
      expiresAt,
      rewards
    };
  }

  private selectRandomDropType() {
    if (this.isDev && this.config.developmentConfig?.fixedDropType) {
      return this.config.dropTypes.find(dt => dt.type === this.config.developmentConfig?.fixedDropType) 
        || this.config.dropTypes[0];
    }

    const totalWeight = this.config.dropTypes.reduce((sum, type) => sum + type.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const dropType of this.config.dropTypes) {
      random -= dropType.weight;
      if (random <= 0) return dropType;
    }
    
    return this.config.dropTypes[0];
  }

  private selectRandomRarity() {
    if (this.isDev && this.config.developmentConfig?.fixedRarity) {
      return this.config.developmentConfig.fixedRarity;
    }

    const totalWeight = this.config.rarityWeights.reduce((sum, rarity) => sum + rarity.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const rarityConfig of this.config.rarityWeights) {
      random -= rarityConfig.weight;
      if (random <= 0) return rarityConfig.rarity;
    }
    
    return this.config.rarityWeights[0].rarity;
  }

  private async generateRewards(dropType: DropTypeConfig): Promise<Prisma.RewardCreateWithoutDropInput[]> {
    const rewards: Prisma.RewardCreateWithoutDropInput[] = [];
    
    for (const rewardConfig of dropType.rewards) {
      if (rewardConfig.type === RewardType.CARD) {
        const card = await this.getRandomCard();
        if (card) {
          rewards.push({
            type: RewardType.CARD,
            amount: 1,
            card: {
              connect: {
                id: card.id
              }
            }
          });
        }
      } else {
        rewards.push({
          type: rewardConfig.type as RewardType,
          amount: Math.floor(Math.random() * (rewardConfig.maxAmount - rewardConfig.minAmount + 1)) + rewardConfig.minAmount
        });
      }
    }
    
    return rewards;
  }

  private async getRandomCard() {
    const totalCards = await prisma.card.count({
      where: {
        AND: [
          { isExclusive: false },
          { isPromotional: false }
        ]
      }
    });

    if (totalCards === 0) return null;

    const skip = Math.floor(Math.random() * totalCards);

    return await prisma.card.findFirst({
      where: {
        AND: [
          { isExclusive: false },
          { isPromotional: false }
        ]
      },
      skip: skip,
      take: 1
    });
  }

  private generateValidLocation(area: GenerationArea, dropType: any, existingDrops: Drop[]) {
    let attempts = 0;
    const maxAttempts = 50;

    while (attempts < maxAttempts) {
      const location = this.generateRandomLocation(area);
      
      if (this.isValidLocation(location, dropType, existingDrops)) {
        return location;
      }
      
      attempts++;
    }

    return null;
  }

  private generateRandomLocation(area: GenerationArea) {
    const r = area.radius * Math.sqrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;
    
    const dx = r * Math.cos(theta);
    const dy = r * Math.sin(theta);
    
    return {
      latitude: area.latitude + (dy / 111320),
      longitude: area.longitude + (dx / (111320 * Math.cos(area.latitude * (Math.PI / 180))))
    };
  }

  private isValidLocation(location: any, dropType: any, existingDrops: Drop[]) {
    return existingDrops.every(drop => {
      const distance = this.calculateDistance(
        location.latitude,
        location.longitude,
        drop.latitude,
        drop.longitude
      );
      return distance >= dropType.minDistance;
    });
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private async getNearestCircuit(latitude: number, longitude: number) {
    const circuits = await prisma.circuit.findMany({
      where: {
        latitude: {
          gte: latitude - 0.1,
          lte: latitude + 0.1
        },
        longitude: {
          gte: longitude - 0.1,
          lte: longitude + 0.1
        }
      }
    });

    if (circuits.length === 0) return null;

    return circuits.reduce((nearest: any, circuit: any) => {
      const distance = this.calculateDistance(
        latitude,
        longitude,
        circuit.latitude,
        circuit.longitude
      );
      
      if (!nearest || distance < nearest.distance) {
        return { ...circuit, distance };
      }
      return nearest;
    }, null);
  }
} 