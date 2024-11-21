//@ts-nocheck
//@ts-nocheck
const { PrismaClient, PackType, Rarity } = require('@prisma/client');

const prisma = new PrismaClient();

const packs = [
  // Standard Packs
  {
    name: "Standard Pack",
    description: "5 cards with at least one Rare card",
    price: 1000,
    type: "STANDARD",
    imageUrl: "/packs/standard.jpg",
    cardsPerPack: 5,
    dropRates: {
      COMMON: 70,
      RARE: 20,
      EPIC: 8,
      LEGENDARY: 2,
    },
    guaranteedRarities: ["RARE"],
    isLimited: false,
    isPromotional: false
  },
  {
    name: "Premium Pack",
    description: "5 cards with at least one Epic card",
    price: 2500,
    type: "PREMIUM",
    imageUrl: "/packs/premium.jpg",
    cardsPerPack: 5,
    dropRates: {
      RARE: 60,
      EPIC: 30,
      LEGENDARY: 10,
    },
    guaranteedRarities: ["EPIC"],
    isLimited: false,
    isPromotional: false
  },
  {
    name: "Legendary Pack",
    description: "3 cards with guaranteed Legendary card",
    price: 5000,
    type: "LEGENDARY",
    imageUrl: "/packs/legendary.jpg",
    cardsPerPack: 3,
    dropRates: {
      EPIC: 60,
      LEGENDARY: 40,
    },
    guaranteedRarities: ["LEGENDARY"],
    isLimited: false,
    isPromotional: false
  },

  // Series-Specific Packs
  {
    name: "F1 Champions Pack",
    description: "5 cards featuring F1 World Champions with guaranteed Legendary",
    price: 4000,
    type: "SPECIAL_EDITION",
    imageUrl: "/packs/f1-champions.jpg",
    cardsPerPack: 5,
    dropRates: {
      EPIC: 70,
      LEGENDARY: 30,
    },
    guaranteedRarities: ["LEGENDARY"],
    seriesFilter: "F1",
    cardTypeFilter: "F1_DRIVER",
    isLimited: false,
    isPromotional: false
  },
  {
    name: "Historic Moments Pack",
    description: "4 cards featuring legendary racing moments",
    price: 3500,
    type: "SPECIAL_EDITION",
    imageUrl: "/packs/historic.jpg",
    cardsPerPack: 4,
    dropRates: {
      RARE: 40,
      EPIC: 40,
      LEGENDARY: 20,
    },
    guaranteedRarities: ["EPIC"],
    cardTypeFilter: "HISTORIC_MOMENT",
    isLimited: false,
    isPromotional: false
  },

  // Event-Specific Packs
  {
    name: "Monaco Grand Prix Special",
    description: "5 cards featuring Monaco GP legends and moments",
    price: 3000,
    type: "SPECIAL_EDITION",
    imageUrl: "/packs/monaco.jpg",
    cardsPerPack: 5,
    dropRates: {
      RARE: 50,
      EPIC: 35,
      LEGENDARY: 15,
    },
    guaranteedRarities: ["EPIC"],
    eventFilter: "Monaco GP",
    isLimited: true,
    limitedQuantity: 500,
    isPromotional: false
  },
  {
    name: "Le Mans Pack",
    description: "4 cards celebrating Le Mans history",
    price: 3000,
    type: "SPECIAL_EDITION",
    imageUrl: "/packs/lemans.jpg",
    cardsPerPack: 4,
    dropRates: {
      RARE: 45,
      EPIC: 40,
      LEGENDARY: 15,
    },
    guaranteedRarities: ["EPIC"],
    seriesFilter: "WEC",
    eventFilter: "Le Mans",
    isLimited: false,
    isPromotional: false
  },

  // Team Packs
  {
    name: "Ferrari Legacy Pack",
    description: "5 cards featuring Ferrari's greatest moments",
    price: 3500,
    type: "SPECIAL_EDITION",
    imageUrl: "/packs/ferrari.jpg",
    cardsPerPack: 5,
    dropRates: {
      RARE: 40,
      EPIC: 40,
      LEGENDARY: 20,
    },
    guaranteedRarities: ["EPIC"],
    teamFilter: "Ferrari",
    isLimited: false,
    isPromotional: false
  },

  // Circuit Packs
  {
    name: "Legendary Circuits Pack",
    description: "3 cards featuring iconic racing circuits",
    price: 2500,
    type: "SPECIAL_EDITION",
    imageUrl: "/packs/circuits.jpg",
    cardsPerPack: 3,
    dropRates: {
      EPIC: 70,
      LEGENDARY: 30,
    },
    guaranteedRarities: ["EPIC"],
    cardTypeFilter: "CIRCUIT",
    isLimited: false,
    isPromotional: false
  },

  // Limited Edition Packs
  {
    name: "2023 Champions Collection",
    description: "5 cards featuring 2023's champions across motorsports",
    price: 5000,
    type: "SPECIAL_EDITION",
    imageUrl: "/packs/2023-champions.jpg",
    cardsPerPack: 5,
    dropRates: {
      EPIC: 60,
      LEGENDARY: 40,
    },
    guaranteedRarities: ["LEGENDARY"],
    yearFilter: 2023,
    isLimited: true,
    limitedQuantity: 1000,
    isPromotional: false
  },

  // Promotional Packs
  {
    name: "Las Vegas GP Launch Pack",
    description: "4 special cards celebrating F1's return to Las Vegas",
    price: 4000,
    type: "SPECIAL_EDITION",
    imageUrl: "/packs/vegas.jpg",
    cardsPerPack: 4,
    dropRates: {
      EPIC: 70,
      LEGENDARY: 30,
    },
    guaranteedRarities: ["EPIC"],
    eventFilter: "Las Vegas GP",
    seriesFilter: "F1",
    isLimited: true,
    limitedQuantity: 2000,
    isPromotional: true
  },

  // Driver-Specific Packs
  {
    name: "Verstappen Champion Pack",
    description: "4 cards featuring Max Verstappen's achievements",
    price: 4500,
    type: "SPECIAL_EDITION",
    imageUrl: "/packs/verstappen.jpg",
    cardsPerPack: 4,
    dropRates: {
      EPIC: 60,
      LEGENDARY: 40,
    },
    guaranteedRarities: ["LEGENDARY"],
    driverFilter: "Max Verstappen",
    seriesFilter: "F1",
    isLimited: true,
    limitedQuantity: 333,
    isPromotional: false
  }
];

async function main() {
  console.log('Starting pack seeding...');

  // Clear existing packs
  await prisma.pack.deleteMany();
  console.log('Cleared existing packs');

  // Create all packs
  for (const pack of packs) {
    await prisma.pack.create({
      data: {
        name: pack.name,
        description: pack.description,
        price: pack.price,
        type: pack.type,
        imageUrl: pack.imageUrl,
        cardsPerPack: pack.cardsPerPack,
        dropRates: pack.dropRates,
        guaranteedRarities: pack.guaranteedRarities,
        cardTypeFilter: pack.cardTypeFilter,
        seriesFilter: pack.seriesFilter,
        yearFilter: pack.yearFilter,
        teamFilter: pack.teamFilter,
        driverFilter: pack.driverFilter,
        eventFilter: pack.eventFilter,
        isLimited: pack.isLimited,
        limitedQuantity: pack.limitedQuantity,
        isPromotional: pack.isPromotional,
      },
    });
    console.log(`Created pack: ${pack.name}`);
  }

  console.log('Pack seeding completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });