// @ts-nocheck
import { DropGenerationConfig } from "./types";
import { DropType, Rarity, RewardType } from '@prisma/client';

export const DEFAULT_CONFIG: DropGenerationConfig = {
  minDropsPerArea: 3,
  maxDropsPerArea: 8,
  respawnTimeMinutes: 30,
  rarityWeights: [
    { rarity: Rarity.COMMON, weight: 50 },
    { rarity: Rarity.RARE, weight: 30 },
    { rarity: Rarity.EPIC, weight: 15 },
    { rarity: Rarity.LEGENDARY, weight: 5 }
  ],
  dropTypes: [
    {
      type: DropType.STANDARD,
      weight: 40,
      minDistance: 50,
      rewards: [
        { type: RewardType.CARD, minAmount: 1, maxAmount: 1, weight: 100 }
      ]
    },
    {
      type: DropType.COINS,
      weight: 30,
      minDistance: 30,
      rewards: [
        { type: RewardType.COINS, minAmount: 50, maxAmount: 200, weight: 100 }
      ]
    },
    {
      type: DropType.SPECIAL,
      weight: 10,
      minDistance: 100,
      rewards: [
        { type: RewardType.SPECIAL_ITEM, minAmount: 1, maxAmount: 1, weight: 100 }
      ]
    }
  ]
};

export const DEVELOPMENT_CONFIG: DropGenerationConfig = {
  minDropsPerArea: 1,
  maxDropsPerArea: 3,
  respawnTimeMinutes: 2,
  isDevelopment: true,
  developmentConfig: {
    fixedDropCount: 5,
    shortRespawnTime: 4,
  },
  rarityWeights: [
    { rarity: Rarity.COMMON, weight: 70 },
    { rarity: Rarity.RARE, weight: 20 },
    { rarity: Rarity.EPIC, weight: 5 },
    { rarity: Rarity.LEGENDARY, weight: 5 }
  ],
  dropTypes: [
    {
      type: DropType.STANDARD,
      weight: 100,
      minDistance: 10,
      rewards: [
        { type: RewardType.CARD, minAmount: 1, maxAmount: 1, weight: 100 }
      ]
    }
  ]
}; 