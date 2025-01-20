//@ts-nocheck
import { PrismaClient, CardType, Rarity } from '@prisma/client';

const prisma = new PrismaClient();

const CARD_CONFIG = {
  // Total cards per series
  SERIES_LIMITS: {
    F1: {
      DRIVERS: 20,
      CARS: 10,
      HISTORIC: 50,
      TEAMS: 10,
      CIRCUITS: 24
    },
    F2: {
      DRIVERS: 22,
      CARS: 11,
      TEAMS: 11,
      CIRCUITS: 14
    }
  },

  // Rarity distribution percentages
  RARITY_DISTRIBUTION: {
    COMMON: 70,
    RARE: 20,
    EPIC: 8,
    LEGENDARY: 2
  },

  // Maximum prints per rarity
  MAX_PRINTS: {
    COMMON: 10000,
    RARE: 5000,
    EPIC: 1000,
    LEGENDARY: 50
  },

  // Serial number format
  SERIAL_NUMBER_FORMAT: {
    PREFIX: {
      F1: 'F1',
      F2: 'F2',
      F3: 'F3',
      WEC: 'WEC',
      INDYCAR: 'IND',
      NASCAR: 'NSC'
    },
    YEAR_FORMAT: 'YY',
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


function generateSerialNumber({ series, type, rarity, year, currentCount }:any) {
  const config = CARD_CONFIG;
  
  const prefix = config.SERIAL_NUMBER_FORMAT.PREFIX[series] || 'GEN';
  const yearCode = year.toString().slice(-2);
  const rarityCode = config.SERIAL_NUMBER_FORMAT.RARITY_CODE[rarity];
  const separator = config.SERIAL_NUMBER_FORMAT.SEPARATOR;
  const sequentialNumber = (currentCount + 1)
    .toString()
    .padStart(config.SERIAL_NUMBER_FORMAT.DIGITS, '0');

  return `${prefix}${separator}${yearCode}${separator}${rarityCode}${separator}${sequentialNumber}`;
}

const cardCounts = {
  F1: { COMMON: 0, RARE: 0, EPIC: 0, LEGENDARY: 0 },
  F2: { COMMON: 0, RARE: 0, EPIC: 0, LEGENDARY: 0 },
  WEC: { COMMON: 0, RARE: 0, EPIC: 0, LEGENDARY: 0 },
  INDYCAR: { COMMON: 0, RARE: 0, EPIC: 0, LEGENDARY: 0 },
  NASCAR: { COMMON: 0, RARE: 0, EPIC: 0, LEGENDARY: 0 },
};

async function generateCards(cardTemplate: any, prints: number) {
  const cards = [];
  for (let i = 0; i < prints; i++) {
    const serialNumber = generateSerialNumber({
      series: cardTemplate.series,
      type: cardTemplate.type as CardType,
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

async function main() {

  const formula1season2025 = [
    {
      name: 'Carlos Sainz',
      type: 'F1_DRIVER',
      rarity: 'RARE',
      imageUrl: 'https://pitdeck-app.s3.eu-north-1.amazonaws.com/2025/formula1-commmons/sainz.avif',
      description: 'Carlos Sainz is a Spanish racing driver who currently drives for the Williams Racing team in Formula 1.',
      series: 'F1',
      edition: '2025',
      year: 2025,
      isExclusive: false,
      isPromotional: false,
      stats: {
        podiums: 27,
        points: 1272.5,
        grandPrixEntered: 208,
        highestRaceFinish: "1st",
      }
    }, 
    {
      name: 'Oliver Bearman',
      type: 'F1_DRIVER',
      rarity: 'COMMON',
      imageUrl: 'https://pitdeck-app.s3.eu-north-1.amazonaws.com/2025/formula1-commmons/bearman.avif',
      description: 'Oliver Bearman is a British racing driver who currently drives for the Haas F1 team in Formula 1.',
      series: 'F1',
      edition: '2025',
      year: 2025,
      isExclusive: false,
      isPromotional: false,
      stats: {
        podiums: 0,
        points: 7,
        grandPrixEntered: 3,
        highestRaceFinish: "7th",
      }
    },
    {
      name: 'Esteban Ocon',
      type: 'F1_DRIVER',
      rarity: 'COMMON',
      imageUrl: 'https://pitdeck-app.s3.eu-north-1.amazonaws.com/2025/formula1-commmons/ocon.avif',
      description: 'Esteban Ocon is a French racing driver who currently drives for the Haas F1 team in Formula 1.',
      series: 'F1',
      edition: '2025',
      year: 2025,
      isExclusive: false,
      isPromotional: false,
      stats: {
        podiums: 4,
        points: 445,
        grandPrixEntered: 156,
        highestRaceFinish: "1st",
      }
    },
    {
      name: 'Yuki Tsunoda',
      type: 'F1_DRIVER',
      rarity: 'COMMON',
      imageUrl: 'https://pitdeck-app.s3.eu-north-1.amazonaws.com/2025/formula1-commmons/tsunoda.avif',
      description: 'Yuki Tsunoda is a Japanese racing driver who currently drives for the Racing Bulls team in Formula 1.',
      series: 'F1',
      edition: '2025',
      year: 2025,
      isExclusive: false,
      isPromotional: false,
      stats: {
        podiums: 0,
        points: 91,
        grandPrixEntered: 90,
        highestRaceFinish: "4th",
      }
    },
    {
      name: 'Isack Hadjar',
      type: 'F1_DRIVER',
      rarity: 'COMMON',
      imageUrl: 'https://pitdeck-app.s3.eu-north-1.amazonaws.com/2025/formula1-commmons/hadjar.avif',
      description: 'Isack Hadjar is a French racing driver who currently drives for the Racing Bulls team in Formula 1.',
      series: 'F1',
      edition: '2025',
      year: 2025,
      isExclusive: false,
      isPromotional: false,
      stats: {
        podiums: 0,
        points: 0,
        grandPrixEntered: 0,
        highestRaceFinish: "0th",
      }
    },
    {
      name: 'Jack Doohan',
      type: 'F1_DRIVER',
      rarity: 'COMMON',
      imageUrl: 'https://pitdeck-app.s3.eu-north-1.amazonaws.com/2025/formula1-commmons/doohan.avif',
      description: 'Jack Doohan is an Australian racing driver who currently drives for the Alpine F1 team in Formula 1.',
      series: 'F1',
      edition: '2025',
      year: 2025,
      isExclusive: false,
      isPromotional: false,
      stats: {
        podiums: 0,
        points: 0,
        grandPrixEntered: 1,
        highestRaceFinish: "17th",
      }
    },
    {
      name: 'Pierre Gasly',
      type: 'F1_DRIVER',
      rarity: 'COMMON',
      imageUrl: 'https://pitdeck-app.s3.eu-north-1.amazonaws.com/2025/formula1-commmons/gasly.avif',
      description: 'Pierre Gasly is a French racing driver who currently drives for the Alpine F1 team in Formula 1.',
      series: 'F1',
      edition: '2025',
      year: 2025,
      isExclusive: false,
      isPromotional: false,
      stats: {
        podiums: 5,
        points: 436,
        grandPrixEntered: 154,
        highestRaceFinish: "1st",
      }
    },
    {
      name: 'Fernando Alonso',
      type: 'F1_DRIVER',
      rarity: 'RARE',
      imageUrl: 'https://pitdeck-app.s3.eu-north-1.amazonaws.com/2025/formula1-commons/alonso.avif',
      description: 'Fernando Alonso is a Spanish racing driver who currently drives for the Aston Martin F1 team in Formula 1.',
      series: 'F1',
      edition: '2025',
      year: 2025,
      isExclusive: false,
      isPromotional: false,
      stats: {
        podiums: 106,
        points: 2337,
        grandPrixEntered: 404,
        highestRaceFinish: "1st",
      }
    },
    {
      name: 'Lance Stroll',
      type: 'F1_DRIVER',
      rarity: 'COMMON',
      imageUrl: 'https://pitdeck-app.s3.eu-north-1.amazonaws.com/2025/formula1-commons/stroll.avif',
      description: 'Lance Stroll is a Canadian racing driver who currently drives for the Aston Martin F1 team in Formula 1.',
      series: 'F1',
      edition: '2025',
      year: 2025,
      isExclusive: false,
      isPromotional: false,
      stats: {
        podiums: 3,
        points: 292,
        grandPrixEntered: 167,
        highestRaceFinish: "3rd",
      }
    },
    {
      name: 'Andrea Kimi Antonelli',
      type: 'F1_DRIVER',
      rarity: 'RARE',
      imageUrl: 'https://pitdeck-app.s3.eu-north-1.amazonaws.com/2025/formula1-commons/antonelli.avif',
      description: 'Andrea Kimi Antonelli is an Italian racing driver who currently drives for the Aston Martin F1 team in Formula 1.',
      series: 'F1',
      edition: '2025',
      year: 2025,
      isExclusive: false,
      isPromotional: false,
      stats: {
        podiums: 0,
        points: 0,
        grandPrixEntered: 0,
        highestRaceFinish: "0th",
      }
    },
    {
      name: 'Liam Lawson',
      type: 'F1_DRIVER',
      rarity: 'COMMON',
      imageUrl: 'https://pitdeck-app.s3.eu-north-1.amazonaws.com/2025/formula1-commons/lawson.avif',
      description: 'Liam Lawson is a New Zealand racing driver who currently drives for the Red Bull Racing team in Formula 1.',
      series: 'F1',
      edition: '2025',
      year: 2025,
      isExclusive: false,
      isPromotional: false,
      stats: {
        podiums: 0,
        points: 6,
        grandPrixEntered: 11,
        highestRaceFinish: "9th",
      }
    },
    {
      name: 'Max Verstappen',
      type: 'F1_DRIVER',
      rarity: 'EPIC',
      imageUrl: 'https://pitdeck-app.s3.eu-north-1.amazonaws.com/2025/formula1-commons/verstappen.avif',
      description: 'Max Verstappen is a Dutch racing driver who currently drives for the Red Bull Racing team in Formula 1.',
      series: 'F1',
      edition: '2025',
      year: 2025,
      isExclusive: false,
      isPromotional: false,
      stats: {
        podiums: 112,
        points: 3023.5,
        grandPrixEntered: 209,
        highestRaceFinish: "1st",
      }
    },
    {
      name: 'Lewis Hamilton',
      type: 'F1_DRIVER',
      rarity: 'EPIC',
      imageUrl: 'https://pitdeck-app.s3.eu-north-1.amazonaws.com/2025/formula1-commons/hamilton.avif',
      description: 'Lewis Hamilton is a British racing driver who currently drives for the Ferrari team in Formula 1.',
      series: 'F1',
      edition: '2025',
      year: 2025,
      isExclusive: false,
      isPromotional: false,
      stats: {
        podiums: 202,
        points: 4862.5,
        grandPrixEntered: 356,
        highestRaceFinish: "1st",
      }
    },
    {
      name: 'Charles Leclerc',
      type: 'F1_DRIVER',
      rarity: 'RARE',
      imageUrl: 'https://pitdeck-app.s3.eu-north-1.amazonaws.com/2025/formula1-commons/leclerc.avif',
      description: 'Charles Leclerc is a Monegasque racing driver who currently drives for the Ferrari team in Formula 1.',
      series: 'F1',
      edition: '2025',
      year: 2025,
      isExclusive: false,
      isPromotional: false,
      stats: {
        podiums: 43,
        points: 1430,
        grandPrixEntered: 149,
        highestRaceFinish: "1st",
      }
    }, 
    {
      name: 'Lando Norris',
      type: 'F1_DRIVER',
      rarity: 'RARE',
      imageUrl: 'https://pitdeck-app.s3.eu-north-1.amazonaws.com/2025/formula1-commons/norris.avif',
      description: 'Lando Norris is a British racing driver who currently drives for the McLaren F1 team in Formula 1.',
      series: 'F1',
      edition: '2025',
      year: 2025,
      isExclusive: false,
      isPromotional: false,
      stats: {
        podiums: 26,
        points: 1007,
        grandPrixEntered: 128,
        highestRaceFinish: "1st",
      }
    },
    {
      name: 'Oscar Piastri',
      type: 'F1_DRIVER',
      rarity: 'RARE',
      imageUrl: 'https://pitdeck-app.s3.eu-north-1.amazonaws.com/2025/formula1-commons/piastri.avif',
      description: 'Oscar Piastri is an Australian racing driver who currently drives for the McLaren F1 team in Formula 1.',
      series: 'F1',
      edition: '2025',
      year: 2025,
      isExclusive: false,
      isPromotional: false, 
      stats: {
        podiums: 10,
        points: 389,
        grandPrixEntered: 46,
        highestRaceFinish: "1st",
      }
    }

    
  ]


  // Process each category
  const categories = [
    { data: formula1season2025, name: 'Formula 1 Season 2025' }
  ];

  for (const category of categories) {
    console.log(`Processing ${category.name}...`);
    for (const template of category.data) {
      const maxPrints = CARD_CONFIG.MAX_PRINTS[template.rarity];
      const cards = await generateCards(template, maxPrints);
      
      for (const card of cards) {
        await prisma.card.create({
          data: card,
        });
      }
      
      console.log(`Generated ${maxPrints} cards for ${template.name}`);
    }
  }

  // Print final statistics
  console.log('\nFinal Card Count Statistics:');
  for (const [series, counts] of Object.entries(cardCounts)) {
    console.log(`\n${series}:`);
    for (const [rarity, count] of Object.entries(counts)) {
      console.log(`  ${rarity}: ${count} cards`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });