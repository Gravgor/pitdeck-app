import { DropType, Rarity, RewardType } from '@prisma/client';

export interface DropGenerationConfig {
  minDropsPerArea: number;
  maxDropsPerArea: number;
  respawnTimeMinutes: number;
  dropTypes: DropTypeConfig[];
  rarityWeights: RarityWeight[];
  isDevelopment?: boolean;
  developmentConfig?: {
    fixedDropCount?: number;
    fixedRarity?: Rarity;
    fixedDropType?: DropType;
    shortRespawnTime?: number;
  };
}

export interface GenerationArea {
  latitude: number;
  longitude: number;
  radius: number;
  count: number;
  expiresAt: Date;
}

export interface DropTypeConfig {
  type: DropType;
  weight: number;
  rewards: RewardConfig[];
  minDistance: number;
}

export interface RewardConfig {
  type: RewardType;
  minAmount: number;
  maxAmount: number;
  weight: number;
}

export interface RarityWeight {
  rarity: Rarity;
  weight: number;
} 