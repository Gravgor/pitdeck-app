import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CardGrid } from '@/components/cards/CardGrid';
import { MarketplaceFilters } from '@/components/marketplace/MarketplaceFilters';
import { MarketplaceCardGrid } from '@/components/marketplace/MarketplaceCardGrid';

export default async function MarketplacePage() {
  const session = await getServerSession(authOptions);
  
  const cards = await prisma.card.findMany({
    where: {
      AND: [
        {
          OR: [
            { isForSale: true },
            { isForTrade: true }
          ],
        },
        {
          owners: {
            none: {
              id: session?.user?.id
            }
          }
        }
      ]
    },
    include: {
      owners: {
        select: {
          id: true,
          name: true,
          image: true
        }
      },
      listing: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Marketplace</h1>
          <p className="text-gray-400 mt-1">
            Browse and acquire cards from other collectors
          </p>
        </div>
      </div>

      <MarketplaceFilters />

      <div className="mt-8">
        <MarketplaceCardGrid cards={cards} />
      </div>
    </div>
  );
} 