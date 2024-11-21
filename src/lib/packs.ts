import { Rarity, Pack } from "@prisma/client";
import { prisma } from "./prisma";

interface DropRates {
  COMMON?: number;
  RARE?: number;
  EPIC?: number;
  LEGENDARY?: number;
}

export async function generatePack(packId: string): Promise<string[]> {
  const pack = await prisma.pack.findUnique({
    where: { id: packId },
  });

  if (!pack) throw new Error("Pack type not found");

  const dropRates = pack.dropRates as DropRates;
  const cardIds: string[] = [];

  // First, handle guaranteed rarities
  for (const rarity of pack.guaranteedRarities) {
    const card = await getRandomCardByRarity(rarity);
    if (card) cardIds.push(card.id);
  }

  // Fill remaining slots
  const remainingSlots = pack.cardsPerPack - pack.guaranteedRarities.length;
  for (let i = 0; i < remainingSlots; i++) {
    const rarity = determineRarity(dropRates);
    const card = await getRandomCardByRarity(rarity);
    if (card) cardIds.push(card.id);
  }

  return cardIds;
}

async function getRandomCardByRarity(rarity: Rarity) {
  const cards = await prisma.card.findMany({
    where: { rarity },
  });

  if (cards.length === 0) return null;
  return cards[Math.floor(Math.random() * cards.length)];
}

function determineRarity(dropRates: DropRates): Rarity {
  const rand = Math.random() * 100;
  let cumulative = 0;

  for (const [rarity, rate] of Object.entries(dropRates)) {
    cumulative += rate;
    if (rand <= cumulative) {
      return rarity as Rarity;
    }
  }

  return "COMMON";
}