//@ts-nocheck
import { PrismaClient, CardType, Rarity } from '@prisma/client';

const prisma = new PrismaClient();

// Configuration constants
const CARD_CONFIG = {
  SERIES_LIMITS: {
    F1: { DRIVERS: 20, CARS: 10, HISTORIC: 50, TEAMS: 10, CIRCUITS: 24 },
    F2: { DRIVERS: 22, CARS: 11, TEAMS: 11, CIRCUITS: 14 }
  },
  RARITY_DISTRIBUTION: {
    COMMON: 70,
    RARE: 20,
    EPIC: 8,
    LEGENDARY: 2
  },
  MAX_PRINTS: {
    COMMON: 10000,
    RARE: 5000,
    EPIC: 1000,
    LEGENDARY: 100
  },
  SERIAL_FORMAT: {
    PREFIX: {
      F1: 'F1',
      F2: 'F2',
      F3: 'F3',
      WEC: 'WEC',
      INDYCAR: 'IND',
      NASCAR: 'NSC'
    },
    SEPARATOR: '-',
    RARITY_CODE: {
      COMMON: 'C',
      RARE: 'R',
      EPIC: 'E',
      LEGENDARY: 'L'
    },
    DIGITS: 6
  }
};

// Track card counts for serial numbers
const cardCounts = {
  F1: { COMMON: 0, RARE: 0, EPIC: 0, LEGENDARY: 0 },
  F2: { COMMON: 0, RARE: 0, EPIC: 0, LEGENDARY: 0 },
  WEC: { COMMON: 0, RARE: 0, EPIC: 0, LEGENDARY: 0 },
  INDYCAR: { COMMON: 0, RARE: 0, EPIC: 0, LEGENDARY: 0 },
  NASCAR: { COMMON: 0, RARE: 0, EPIC: 0, LEGENDARY: 0 }
};

// Helper functions
function generateSerialNumber({ series, rarity, year, currentCount }: {
  series: string;
  rarity: Rarity;
  year: number;
  currentCount: number;
}): string {
  const prefix = CARD_CONFIG.SERIAL_FORMAT.PREFIX[series] || 'GEN';
  const yearCode = year.toString().slice(-2);
  const rarityCode = CARD_CONFIG.SERIAL_FORMAT.RARITY_CODE[rarity];
  const separator = CARD_CONFIG.SERIAL_FORMAT.SEPARATOR;
  const sequentialNumber = (currentCount + 1)
    .toString()
    .padStart(CARD_CONFIG.SERIAL_FORMAT.DIGITS, '0');

  return `${prefix}${separator}${yearCode}${separator}${rarityCode}${separator}${sequentialNumber}`;
}

async function generateCards(cardTemplate: any, prints: number) {
  const cards = [];
  for (let i = 0; i < prints; i++) {
    const serialNumber = generateSerialNumber({
      series: cardTemplate.series,
      rarity: cardTemplate.rarity as Rarity,
      year: cardTemplate.year,
      currentCount: cardCounts[cardTemplate.series][cardTemplate.rarity]
    });

    cards.push({
      ...cardTemplate,
      serialNumber,
    });

    cardCounts[cardTemplate.series][cardTemplate.rarity]++;
  }
  return cards;
}

// Card data
const formula1_2025_drivers = [
  {
    name: 'Charles Leclerc Triumphs at Monaco: Breaking the Curse',
    type: 'ICONIC_MOMENT',
    rarity: 'LEGENDARY',
    imageUrl: 'https://pitdeck-app.s3.eu-north-1.amazonaws.com/2025/cards/leclerc-broke-curse.png',
    description: 'In a historic moment for Ferrari, Charles Leclerc shattered his Monaco Grand Prix jinx in 2024, claiming a long-awaited victory on home soil.',
    series: 'F1',
    edition: '2024',
    year: 2024,
    isExclusive: false,
    isPromotional: false,
  },
];

const formula1_2025_cars = [
  // Car templates
];

const formula1_2025_circuits = [
  // Circuit templates
];



async function main() {
  try {
    console.log('Starting seed...');

    // Generate and insert cards
    const allCardTemplates = [
    ];

    for (const template of allCardTemplates) {
      const prints = CARD_CONFIG.MAX_PRINTS[template.rarity];
      const cards = await generateCards(template, prints);
      
      await prisma.card.createMany({
        data: cards,
        skipDuplicates: true,
      });

      console.log(`Generated ${prints} cards for ${template.name}`);
    }

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });