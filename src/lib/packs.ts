import { prisma } from "@/lib/prisma";
import { Rarity, Card } from "@prisma/client";

interface GeneratePackOptions {
  packId: string;
  count: number;
  guaranteedRarities: string[];
  seriesId?: string;
}

export async function generatePackCards({
  packId,
  count,
  guaranteedRarities,
  seriesId
}: GeneratePackOptions): Promise<Card[]> {
  const pack = await prisma.pack.findUnique({
    where: { id: packId },
  });

  if (!pack) throw new Error("Pack not found");

  const dropRates = pack.dropRates as Record<Rarity, number>;
  const availableCards: Card[] = [];

  // First, get guaranteed rarity cards
  for (const rarity of guaranteedRarities) {
    const cards = await getRandomCardsByRarity(rarity as Rarity, 2, seriesId); // Get 2 of each guaranteed rarity
    availableCards.push(...cards);
  }

  // Calculate how many more cards we need
  const remainingCount = count - availableCards.length;

  // Fill remaining slots with random cards based on drop rates
  const remainingCards = await generateRandomCards(remainingCount, dropRates, seriesId);
  availableCards.push(...remainingCards);

  // Shuffle the array to randomize card positions
  return shuffleArray(availableCards);
}

async function getRandomCardsByRarity(
  rarity: Rarity, 
  count: number,
  seriesId?: string
): Promise<Card[]> {
  const whereClause = {
    rarity,
    ...(seriesId && { seriesId })
  };

  const cards = await prisma.card.findMany({
    where: whereClause,
  });

  if (cards.length === 0) return [];

  const selectedCards: Card[] = [];
  for (let i = 0; i < count; i++) {
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    // Avoid duplicates if possible
    if (!selectedCards.find(c => c.id === randomCard.id)) {
      selectedCards.push(randomCard);
    }
  }

  return selectedCards;
}

async function generateRandomCards(
  count: number,
  dropRates: Record<Rarity, number>,
  seriesId?: string
): Promise<Card[]> {
  const cards: Card[] = [];

  for (let i = 0; i < count; i++) {
    const rarity = determineRarity(dropRates);
    const randomCards = await getRandomCardsByRarity(rarity, 1, seriesId);
    if (randomCards.length > 0) {
      cards.push(randomCards[0]);
    }
  }

  return cards;
}

function determineRarity(dropRates: Record<Rarity, number>): Rarity {
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

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}