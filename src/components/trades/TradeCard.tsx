'use client';

import { Card } from '@prisma/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { formatDistance } from 'date-fns';
import { Trade } from '@/types/trade';

interface TradeCardProps {
  trade: Trade;
}

export function TradeCard({ trade }: TradeCardProps) {
  const router = useRouter();

  return (
    <div 
      onClick={() => router.push(`/trades/${trade.id}`)}
      className="bg-[#12141A] rounded-lg p-4 cursor-pointer hover:bg-[#1A1D25] transition-colors"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold">{trade.sender.name}</h3>
          <p className="text-sm text-gray-400">
            {formatDistance(new Date(trade.createdAt), new Date(), { addSuffix: true })}
          </p>
        </div>
        <div className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-sm">
          {trade.coins > 0 ? `${trade.coins} coins` : 'Cards only'}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {trade.offeredCards.slice(0, 4).map((card: Card) => (
          <div key={card.id} className="relative aspect-square rounded-md overflow-hidden">
            <Image
              src={card.imageUrl}
              alt={card.name}
              fill
              className="object-cover"
            />
          </div>
        ))}
        {trade.offeredCards.length > 4 && (
          <div className="relative aspect-square rounded-md bg-white/10 flex items-center justify-center">
            <span className="text-sm font-medium">+{trade.offeredCards.length - 4}</span>
          </div>
        )}
      </div>

      {trade.note && (
        <p className="text-sm text-gray-400 line-clamp-2">{trade.note}</p>
      )}
    </div>
  );
} 