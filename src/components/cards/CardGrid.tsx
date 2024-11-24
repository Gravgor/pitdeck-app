//@ts-nocheck
'use client';

import { Card, Rarity } from '@prisma/client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Crown, Star, Trophy, Medal } from 'lucide-react';
import { toast } from 'sonner';
import { CardActions } from './CardActions';
import { useState } from 'react';
import { CardModal } from './CardModal';

interface CardGridProps {
  cards: Card[];
  showActions?: boolean;
}

// Add this new function to check for special serials
function isSpecialSerial(serialNumber: string): boolean {
  const num = parseInt(serialNumber);
  return num >= 1 && num <= 5;
}

// Add this function to get ordinal suffix
function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
}

export function CardGrid({ cards, showActions = true }: CardGridProps) {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const handleSellCard = async (cardId: string, price: number) => {
    try {
      const res = await fetch('/api/cards/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId, price }),
      });

      if (!res.ok) throw new Error('Failed to list card');

      toast.success('Card listed for sale successfully');
    } catch (error) {
      toast.error('Failed to list card for sale');
      console.error('Error listing card:', error);
    }
  };

  const handleTradeCard = async (cardId: string) => {
    try {
      const res = await fetch('/api/cards/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId }),
      });

      if (!res.ok) throw new Error('Failed to list card for trade');

      toast.success('Card listed for trade successfully');
    } catch (error) {
      toast.error('Failed to list card for trade');
      console.error('Error listing card for trade:', error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            onClick={() => setSelectedCard(card)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`group relative aspect-[2/3] rounded-xl overflow-hidden 
                       ${getRarityBorder(card.rarity)}
                       cursor-pointer
                       hover:scale-105 hover:shadow-2xl transition-all duration-300`}
          >
            {showActions && (
              <CardActions
                card={card}
                onSell={(price) => handleSellCard(card.id, price)}
                onTrade={() => handleTradeCard(card.id)}
              />
            )}

            {/* Special Serial Badge - Add this before the Rarity Badge */}
            {isSpecialSerial(card.serialNumber) && (
              <div className="absolute top-3 left-3 z-30">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 
                             p-2 rounded-full shadow-lg shadow-yellow-500/20"
                >
                  <div className="text-center">
                    <span className="text-xs font-bold text-black">
                      {parseInt(card.serialNumber || '0')}
                      {getOrdinalSuffix(parseInt(card.serialNumber || '0'))}
                    </span>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Rarity Badge */}
            <div className={`absolute top-3 right-3 z-20 
                            ${getRarityBadgeStyle(card.rarity)}`}>
              {getRarityIcon(card.rarity)}
            </div>

            {/* Card Image */}
            <div className="relative w-full h-full">
              <Image
                src={card.imageUrl}
                alt={card.name}
                placeholder="blur"
                loading="lazy"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              
              {/* Rarity Overlay Effect */}
              <div className={`absolute inset-0 ${getRarityOverlay(card.rarity)}`} />

              {/* Sale/Trade Badges */}
              {(card.isForSale || card.isForTrade) && (
                <div className="absolute top-3 left-3 flex gap-2">
                  {card.isForSale && (
                    <span className="px-2 py-1 bg-green-500/90 text-white text-xs rounded-full">
                      {card.price} RC
                    </span>
                  )}
                  {card.isForTrade && (
                    <span className="px-2 py-1 bg-blue-500/90 text-white text-xs rounded-full">
                      For Trade
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {/* Card Info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider 
                                  ${getRarityTagStyle(card.rarity)}`}>
                    {card.rarity}
                  </span>
                  <span className="text-xs text-white/80">{card.type.replace(/_/g, ' ')}</span>
                </div>
                <h3 className="text-white font-medium tracking-wide text-lg truncate">{card.name}</h3>
                <p className={`text-xs ${
                  card.serialNumber && isSpecialSerial(card.serialNumber)
                    ? 'text-yellow-400 font-semibold'
                    : 'text-white/60'
                } mt-1`}>
                  #{card.serialNumber}
                  {card.serialNumber && isSpecialSerial(card.serialNumber) && (
                    <span className="ml-1 text-yellow-500">
                      {parseInt(card.serialNumber)}
                      {getOrdinalSuffix(parseInt(card.serialNumber))} Mint
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Stats Overlay on Hover */}
            <div className="absolute inset-0 bg-black/95 opacity-0 group-hover:opacity-100 
                          transition-all duration-300 p-6 flex flex-col">
              <h3 className="text-white font-bold text-lg mb-2">{card.name}</h3>
              <p className="text-sm text-white/80 mb-4 line-clamp-3">{card.description}</p>
              
              {card.stats && (
                <div className="mt-auto space-y-2">
                  <h4 className="text-sm font-semibold text-white/90 mb-3">Statistics</h4>
                  {Object.entries(card.stats as Record<string, number>).map(([key, value]) => (
                    <div key={key} className="relative w-full">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/70 capitalize">{key.replace(/_/g, ' ')}</span>
                        <span className="text-white font-medium">{value}</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${value}%` }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                          className={`h-full rounded-full ${getStatBarColor(card.rarity)}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <CardModal
        card={selectedCard!}
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        showActions={showActions}
      />
    </>
  );
}

function getRarityIcon(rarity: Rarity) {
  switch (rarity) {
    case 'LEGENDARY':
      return <Crown className="h-5 w-5" />;
    case 'EPIC':
      return <Trophy className="h-5 w-5" />;
    case 'RARE':
      return <Star className="h-5 w-5" />;
    default:
      return <Medal className="h-5 w-5" />;
  }
}

function getRarityBorder(rarity: Rarity): string {
  switch (rarity) {
    case 'LEGENDARY':
      return 'ring-2 ring-yellow-400/50 shadow-lg shadow-yellow-400/20';
    case 'EPIC':
      return 'ring-2 ring-purple-400/50 shadow-lg shadow-purple-400/20';
    case 'RARE':
      return 'ring-2 ring-blue-400/50 shadow-lg shadow-blue-400/20';
    default:
      return 'ring-1 ring-gray-400/30';
  }
}

function getRarityOverlay(rarity: Rarity): string {
  switch (rarity) {
    case 'LEGENDARY':
      return 'bg-gradient-to-t from-yellow-900/30 to-transparent';
    case 'EPIC':
      return 'bg-gradient-to-t from-purple-900/30 to-transparent';
    case 'RARE':
      return 'bg-gradient-to-t from-blue-900/30 to-transparent';
    default:
      return 'bg-gradient-to-t from-gray-900/30 to-transparent';
  }
}

function getRarityBadgeStyle(rarity: Rarity): string {
  switch (rarity) {
    case 'LEGENDARY':
      return 'bg-yellow-400/90 text-yellow-900 p-1.5 rounded-full';
    case 'EPIC':
      return 'bg-purple-400/90 text-purple-900 p-1.5 rounded-full';
    case 'RARE':
      return 'bg-blue-400/90 text-blue-900 p-1.5 rounded-full';
    default:
      return 'bg-gray-400/90 text-gray-900 p-1.5 rounded-full';
  }
}

function getRarityTagStyle(rarity: Rarity): string {
  switch (rarity) {
    case 'LEGENDARY':
      return 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50';
    case 'EPIC':
      return 'bg-purple-400/20 text-purple-400 border border-purple-400/50';
    case 'RARE':
      return 'bg-blue-400/20 text-blue-400 border border-blue-400/50';
    default:
      return 'bg-gray-400/20 text-gray-400 border border-gray-400/50';
  }
}

function getStatBarColor(rarity: Rarity): string {
  switch (rarity) {
    case 'LEGENDARY':
      return 'bg-gradient-to-r from-yellow-600 to-yellow-400';
    case 'EPIC':
      return 'bg-gradient-to-r from-purple-600 to-purple-400';
    case 'RARE':
      return 'bg-gradient-to-r from-blue-600 to-blue-400';
    default:
      return 'bg-gradient-to-r from-gray-600 to-gray-400';
  }
}