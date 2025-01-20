import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { Rarity } from '@prisma/client';

const CARDS_PER_PAGE = 20;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const rarity = searchParams.get('rarity') as Rarity | null || null;
  const type = searchParams.get('type') || '';
  const series = searchParams.get('series') || '';
  const year = searchParams.get('year') || '';

  const where = {
    AND: [
      search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { series: { contains: search, mode: 'insensitive' as const } },
        ],
      } : {},
      rarity ? { rarity: rarity as Rarity } : {},
      type ? { type } : {},
      series ? { series } : {},
      year ? { year: parseInt(year) } : {},
    ].filter(condition => Object.keys(condition).length > 0)
  };

  const cards = await prisma.card.findMany({
    // @ts-ignore
    where,
    skip: (page - 1) * CARDS_PER_PAGE,
    take: CARDS_PER_PAGE,
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      name: true,
      type: true,
      rarity: true,
      imageUrl: true,
      serialNumber: true,
      series: true,
      year: true,
      stats: true,
    },
  });

  return NextResponse.json(cards);
} 