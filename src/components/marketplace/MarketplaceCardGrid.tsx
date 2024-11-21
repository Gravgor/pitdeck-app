//@ts-nocheck
'use client';

import { Card, Rarity } from '@prisma/client';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Star, Trophy, Medal, ShoppingCart, RefreshCw, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface MarketplaceCardGridProps {
    cards: Card[];
  }

export function MarketplaceCardGrid({ cards }: MarketplaceCardGridProps) {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePurchase = async (card: Card) => {
    if (!card.isForSale || !card.listing?.price) return;
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/cards/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId: card.id }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to purchase card');
      }

      toast.success('Card purchased successfully!');
      setSelectedCard(null);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to purchase card');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`group relative aspect-[2/3] rounded-xl overflow-hidden 
                       ${getRarityBorder(card.rarity)}
                       hover:scale-105 hover:shadow-2xl transition-all duration-300
                       cursor-pointer`}
            onClick={() => setSelectedCard(card)}
          >
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
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              
              {/* Rarity Overlay Effect */}
              <div className={`absolute inset-0 ${getRarityOverlay(card.rarity)}`} />

              {/* Owner Info */}
              <div className="absolute top-3 left-3 flex items-center gap-2 z-20">
                {card.owners[0].image ? (
                  <Image
                    src={card.owners[0].image}
                    alt={card.owners[0].name}   
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="text-xs text-white/60">
                      {card.owners[0].name.charAt(0)}
                    </span>
                  </div>
                )}
                <span className="text-xs text-white/60 truncate">
                  {card.owners[0].name}
                </span>
              </div>

              {/* Price/Trade Badge */}
              <div className="absolute top-12 left-3 flex gap-2">
                {card.isForSale && (
                  <div className="px-3 py-1.5 bg-green-500 rounded-full flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-white" />
                    <span className="text-white font-medium">{card.listing?.price} RC</span>
                  </div>
                )}
                {card.isForTrade && (
                  <div className="px-3 py-1.5 bg-blue-500 rounded-full flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-white" />
                    <span className="text-white font-medium">Trade</span>
                  </div>
                )}
              </div>
            </div>

            {/* Card Info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider 
                                  ${getRarityTagStyle(card.rarity)}`}>
                    {card.rarity}
                  </span>
                  <span className="text-xs text-white/80">{card.type}</span>
                </div>
                <h3 className="text-white font-medium text-lg truncate">{card.name}</h3>
                <p className="text-xs text-white/60 mt-1">#{card.serialNumber}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Purchase Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-black/90 border border-white/10 rounded-xl p-6 max-w-lg w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedCard(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex gap-6">
                <div className="w-1/3 aspect-[2/3] relative rounded-lg overflow-hidden">
                  <Image
                    src={selectedCard.imageUrl}
                    alt={selectedCard.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 space-y-4">
                  {/* Owner Info in Modal */}
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    {selectedCard.owners[0].image ? (
                      <Image
                        src={selectedCard.owners[0].image || ''}
                        alt={selectedCard.owners[0].name || ''}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <span className="text-sm text-white/60">
                          {selectedCard.owners[0].name.charAt(0) || ''}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-400">Owner</p>
                      <p className="text-white font-medium">{selectedCard.owners[0].name || ''}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedCard.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">#{selectedCard.serialNumber}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium 
                                     ${getRarityTagStyle(selectedCard.rarity)}`}>
                        {selectedCard.rarity}
                      </span>
                      <span className="text-sm text-gray-400">{selectedCard.type.replace('-', ' ')}</span>
                    </div>
                    <p className="text-sm text-gray-300">{selectedCard.description}</p>
                  </div>

                  {selectedCard.isForSale && (
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-400">Price</span>
                        <span className="text-xl font-bold text-white">
                          {selectedCard.listing?.price} RC
                        </span>
                      </div>
                      <button
                        onClick={() => handlePurchase(selectedCard)}
                        disabled={isLoading}
                        className="w-full flex justify-center items-center gap-2 px-4 py-3
                                 bg-green-500 hover:bg-green-600 rounded-lg 
                                 text-white font-medium transition-colors
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-5 w-5" />
                            Purchase Card
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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