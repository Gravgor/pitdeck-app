import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { Trophy, Star, Users, ChevronRight } from 'lucide-react';

async function getTopCollections() {
  const users = await prisma.user.findMany({
    include: {
      cards: {
        select: {
          rarity: true,
        },
      },
      _count: {
        select: {
          cards: true,
        },
      },
    },
    orderBy: {
      cards: {
        _count: 'desc',
      },
    },
    take: 50,
  });

  return users.map(user => ({
    ...user,
    legendaryCount: user.cards.filter(card => card.rarity === 'LEGENDARY').length,
  }));
}

export default async function CollectionsPage() {
  const topCollectors = await getTopCollections();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white">Top Collections</h1>
          <p className="text-gray-400 mt-2">Discover the most impressive card collections</p>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topCollectors.map((collector) => (
          <Link
            key={collector.id}
            href={`/collection/${collector.name}`}
            className="group relative bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
            
            {/* Collector Info */}
            <div className="relative p-6">
              <div className="flex items-center gap-4">
                <Image
                  src={collector.image || '/default-avatar.png'}
                  alt={collector.name || 'Collector'}
                  width={56}
                  height={56}
                  className="rounded-full ring-2 ring-white/20"
                />
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">
                    {collector.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Joined {new Date(collector.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="p-2 bg-blue-500/10 rounded-lg mx-auto w-fit mb-2">
                    <Trophy className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-lg font-bold text-white">{collector._count.cards}</div>
                  <div className="text-xs text-gray-400">Total Cards</div>
                </div>
                <div className="text-center">
                  <div className="p-2 bg-yellow-500/10 rounded-lg mx-auto w-fit mb-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div className="text-lg font-bold text-white">{collector.legendaryCount}</div>
                  <div className="text-xs text-gray-400">Legendary</div>
                </div>
                <div className="text-center">
                  <div className="p-2 bg-purple-500/10 rounded-lg mx-auto w-fit mb-2">
                    <Users className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="text-lg font-bold text-white">0</div>
                  <div className="text-xs text-gray-400">Followers</div>
                </div>
              </div>

              {/* View Collection Button */}
              <div className="mt-6 flex items-center justify-center">
                <span className="inline-flex items-center gap-1 text-sm text-gray-400 group-hover:text-white transition-colors">
                  View Collection <ChevronRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 