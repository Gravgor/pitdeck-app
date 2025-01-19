'use client';

import { Card } from '@prisma/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { formatDistance } from 'date-fns';
import { Trade } from '@/types/trade';
import { ArrowRight, MessageCircle, Coins } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TradeCardProps {
  trade: Trade;
  onUpdate?: () => void;
}

export function TradeCard({ trade: initialTrade, onUpdate }: TradeCardProps) {
  const router = useRouter();
  const [trade, setTrade] = useState(initialTrade);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  useEffect(() => {
    // Update local state when prop changes
    setTrade(initialTrade);
  }, [initialTrade]);

  useEffect(() => {
    const fetchTradeUpdates = async () => {
      try {
        const response = await fetch(`/api/trades/${trade.id}`, {
          cache: 'no-store',
          headers: {
            'Last-Update': lastUpdate.toString()
          }
        });

        if (!response.ok) throw new Error('Failed to fetch trade updates');
        
        const data = await response.json();
        
        if (JSON.stringify(data.trade) !== JSON.stringify(trade)) {
          setTrade(data.trade);
          setLastUpdate(data.timestamp);
          onUpdate?.();
        }
      } catch (error) {
        console.error('Error fetching trade updates:', error);
      }
    };

    const interval = setInterval(fetchTradeUpdates, 15000);

    return () => clearInterval(interval);
  }, [trade.id, lastUpdate, onUpdate]);

  return (
    <div 
      onClick={() => router.push(`/trading/${trade.id}/offer`)}
      className="bg-[#12141A] hover:bg-[#1A1D25] rounded-xl transition-all duration-200 
                 border border-white/5 hover:border-white/10 cursor-pointer group"
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src={trade.sender.image || '/default-avatar.png'}
                alt={trade.sender.name || 'User'}
                fill
                className="rounded-full object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#12141A]" />
            </div>
            <div>
              <h3 className="font-medium text-white">{trade.sender.name}</h3>
              <p className="text-sm text-gray-400">
                {formatDistance(new Date(trade.createdAt), new Date(), { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {trade.coins > 0 && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-sm">
                <Coins className="w-4 h-4" />
                <span>{trade.coins}</span>
              </div>
            )}
            <div className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm">
              Cards only
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {trade.offeredCards.slice(0, 4).map((card: Card) => (
            <div 
              key={card.id} 
              className="relative aspect-[2/3] rounded-lg overflow-hidden group-hover:ring-2 ring-white/20 transition-all"
            >
              <Image
                src={card.imageUrl}
                alt={card.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-2 left-2">
                  <span className={`text-xs px-1.5 py-0.5 rounded ${getRarityColor(card.rarity)}`}>
                    {card.rarity}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {trade.offeredCards.length > 4 && (
            <div className="relative aspect-[2/3] rounded-lg bg-white/5 flex items-center justify-center">
              <span className="text-sm font-medium text-white">+{trade.offeredCards.length - 4}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {trade.note && (
            <div className="flex items-start gap-2 text-gray-400">
              <MessageCircle className="w-4 h-4 mt-0.5" />
              <p className="text-sm line-clamp-1">{trade.note}</p>
            </div>
          )}
          <div className="ml-auto flex items-center gap-1 text-sm text-blue-400 font-medium">
            View Trade
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

function getRarityColor(rarity: string) {
  switch (rarity) {
    case 'COMMON': return 'bg-gray-600 text-white';
    case 'RARE': return 'bg-blue-500 text-white';
    case 'EPIC': return 'bg-purple-500 text-white';
    case 'LEGENDARY': return 'bg-yellow-500 text-black';
    default: return 'bg-gray-600 text-white';
  }
} 