import { PrismaClient, CardType, Rarity } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface UniqueCard {
  name: string;
  type: CardType;
  rarity: Rarity;
  imageUrl: string;
  description: string;
  edition: string;
  series: string;
  year: number;
  stats: any;
  championshipDetails?: any;
  seasonalDetails?: any;
  historicDetails?: any;
}

async function exportUniqueCards() {
  try {
    // Fetch all cards and group by unique properties
    const allCards = await prisma.card.findMany({
      select: {
        name: true,
        type: true,
        rarity: true,
        imageUrl: true,
        description: true,
        edition: true,
        series: true,
        year: true,
        stats: true,
        championshipDetails: true,
        seasonalDetails: true,
        historicDetails: true,
      },
      orderBy: [
        { series: 'asc' },
        { type: 'asc' },
        { name: 'asc' },
      ],
    });

    // Create a Map to store unique cards using name as key
    const uniqueCardsMap = new Map<string, UniqueCard>();

    allCards.forEach(card => {
      const key = `${card.name}-${card.edition}-${card.series}`;
      if (!uniqueCardsMap.has(key)) {
        uniqueCardsMap.set(key, card as UniqueCard);
      }
    });

    // Convert Map to array and organize by series and type
    const uniqueCards = Array.from(uniqueCardsMap.values());
    const organizedCards = uniqueCards.reduce((acc, card) => {
      if (!acc[card.series]) {
        acc[card.series] = {};
      }
      if (!acc[card.series][card.type]) {
        acc[card.series][card.type] = [];
      }
      acc[card.series][card.type].push(card);
      return acc;
    }, {} as Record<string, Record<string, UniqueCard[]>>);

    // Create output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // Write to JSON file
    fs.writeFileSync(
      path.join(outputDir, 'uniqueCards.json'),
      JSON.stringify(organizedCards, null, 2)
    );

    // Print statistics
    console.log('\nExport Statistics:');
    Object.entries(organizedCards).forEach(([series, types]) => {
      console.log(`\n${series}:`);
      Object.entries(types).forEach(([type, cards]) => {
        console.log(`  ${type}: ${cards.length} unique cards`);
      });
    });

    console.log('\nExport completed successfully!');
    console.log(`File saved to: ${path.join(outputDir, 'uniqueCards.json')}`);

  } catch (error) {
    console.error('Error exporting cards:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportUniqueCards();