import { prisma } from '@/lib/prisma';
import { Card, CardType, Rarity } from '@prisma/client';

export interface Series {
  id: string;
  slug: string;
  name: string;
  description: string;
  heroImage: string;
  stats: {
    totalCards: string;
    legendaryCards: string;
    collectors: string;
    events: string;
  };
  featuredCards: Card[];
  categories: Category[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  count: number;
}

interface SeriesMetadata {
  name: string;
  slug: string;
  description: string;
  heroImage: string;
  categories: {
    id: string;
    name: string;
    description: string;
    image: string;
  }[];
}

const SERIES_METADATA: Record<string, SeriesMetadata> = {
  'f1': {
    name: 'Formula 1',
    slug: 'f1',
    description: 'Collect cards featuring F1 drivers, teams, and historic moments from the pinnacle of motorsport.',
    heroImage: '/series/f1-hero.jpg',
    categories: [
      {
        id: 'f1_driver',
        name: 'Drivers',
        description: 'Current F1 drivers and legends of the sport',
        image: '/categories/f1-drivers.jpg'
      },
      {
        id: 'f1_car',
        name: 'Cars',
        description: '2024 F1 cars and historic championship winners',
        image: '/categories/f1-cars.jpg'
      },
      {
        id: 'legendary_historic',
        name: 'Historic Moments',
        description: 'Iconic moments that defined Formula 1',
        image: '/categories/f1-moments.jpg'
      }
    ]
  },
  'wec': {
    name: 'World Endurance Championship',
    slug: 'wec',
    description: 'Experience the thrill of endurance racing with cards featuring WEC teams, drivers, and legendary races.',
    heroImage: '/series/wec-hero.jpg',
    categories: [
      {
        id: 'wec-drivers',
        name: 'Drivers',
        description: 'Elite endurance racing drivers',
        image: '/categories/wec-drivers.jpg'
      },
      {
        id: 'wec-cars',
        name: 'Hypercars',
        description: 'Next-generation WEC racing machines',
        image: '/categories/wec-cars.jpg'
      },
      {
        id: 'wec-lemans',
        name: 'Le Mans',
        description: 'Special cards from the legendary 24 Hours of Le Mans',
        image: '/categories/lemans.jpg'
      }
    ]
  }
} as const;

export async function getSeriesData(slug: string): Promise<Series> {
  // First get all unique series from the database
  const availableSeries = await prisma.card.findMany({
    distinct: ['series'],
    select: {
      series: true
    }
  });

  // Find the matching series from our metadata
  const seriesId = Object.keys(SERIES_METADATA).find(
    id => SERIES_METADATA[id].slug === slug || id === slug
  );

  if (!seriesId || !availableSeries.some(s => s.series.toLowerCase() === seriesId)) {
    throw new Error(`Series not found: ${slug}`);
  }

  // Get total cards count
  const totalCards = await prisma.card.count({
    where: { series: seriesId.toUpperCase() }
  });
  console.log(totalCards);

  // Get legendary cards count
  const legendaryCards = await prisma.card.count({
    where: { 
      series: seriesId.toUpperCase(),
      rarity: 'LEGENDARY' as Rarity
    }
  });

  const collectors = await prisma.user.count({
    where: {
      cards: {
        some: { series: seriesId.toUpperCase() }
      }
    }
  });

  // Get featured cards (random selection of high-rarity cards)
  const featuredCards = await prisma.card.findMany({
    where: {
      series: seriesId.toUpperCase(),
      OR: [
        { rarity: 'LEGENDARY' as Rarity },
      ]
    },
    take: 10,
    orderBy: {
      rarity: 'asc'
    }
  });

  // If we don't have enough legendary/epic cards, fill with rare cards
  if (featuredCards.length < 10) {
    const additionalCards = await prisma.card.findMany({
      where: {
        series: seriesId.toUpperCase(),
        rarity: 'RARE' as Rarity,
        NOT: {
          id: {
            in: featuredCards.map(card => card.id)
          }
        }
      },
      take: 10 - featuredCards.length,
      orderBy: {
        rarity: 'asc'
      }
    });

    featuredCards.push(...additionalCards);
  }

  // Get categories with card counts
  const categoriesWithCounts = await Promise.all(
    SERIES_METADATA[seriesId].categories.map(async (category) => {
      const count = await prisma.card.count({
        where: {
          series: seriesId.toUpperCase(),
          type: category.id.toUpperCase() as CardType
        }
      });

      return {
        ...category,
        count
      };
    })
  );

  const metadata = SERIES_METADATA[seriesId];

  return {
    id: seriesId,
    slug: metadata.slug,
    name: metadata.name,
    description: metadata.description,
    heroImage: metadata.heroImage,
    stats: {
      totalCards: `${totalCards}+`,
      legendaryCards: legendaryCards.toString(),
      collectors: `${Math.floor(collectors / 1000)}K+`,
      events: '24' // Hardcoded for now, add events table later
    },
    featuredCards,
    categories: categoriesWithCounts
  };
}

export async function getAllSeries(): Promise<Series[]> {
  // Get all unique series from the database
  const availableSeries = await prisma.card.findMany({
    distinct: ['series'],
    select: {
      series: true
    }
  });

  // Only return series that exist in both metadata and database
  return Promise.all(
    availableSeries
      .map(s => s.series)
      .filter(seriesId => SERIES_METADATA[seriesId])
      .map(seriesId => getSeriesData(SERIES_METADATA[seriesId].slug))
  );
}