'use client';

import { Card, Rarity } from '@prisma/client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Heart, Crown, Medal, Star, Trophy } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { CardActions } from './CardActions';

interface CardModalProps {
  card: Card;
  isOpen: boolean;
  onClose: () => void;
  showActions?: boolean;
}

export function CardModal({ card, isOpen, onClose, showActions = true }: CardModalProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-4xl bg-[#12141A] rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Card Image Section */}
              <div className="relative aspect-[3/4] bg-black">
                <Image
                  src={card.imageUrl}
                  alt={card.name}
                  fill
                  className="object-cover"
                />
                <div className={`absolute inset-0 ${getRarityOverlay(card.rarity)}`} />
                
                {/* Rarity Badge */}
                <div className={`absolute top-4 right-4 ${getRarityBadgeStyle(card.rarity)}`}>
                  {getRarityIcon(card.rarity)}
                </div>
              </div>

              {/* Card Info Section */}
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{card.name}</h2>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRarityTagStyle(card.rarity)}`}>
                        {card.rarity}
                      </span>
                      <span className="text-sm text-gray-400">{card.type}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsLiked(!isLiked)}
                      className={`p-2 rounded-full transition-colors ${
                        isLiked ? 'bg-red-500/20 text-red-500' : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <Heart className="h-5 w-5" fill={isLiked ? 'currentColor' : 'none'} />
                    </button>
                    <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-400 mb-6">{card.description}</p>

                {/* Stats Section */}
                {card.stats && (
                  <div className="space-y-4 mb-6">
                    <h3 className="text-lg font-semibold text-white">Statistics</h3>
                    {Object.entries(card.stats as Record<string, number>).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400 capitalize">{key.replace(/_/g, ' ')}</span>
                          <span className="text-white font-medium">{value}</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${value}%` }}
                            transition={{ duration: 0.5 }}
                            className={`h-full rounded-full ${getStatBarColor(card.rarity)}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Serial Number */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-3">
                      <span className="text-sm text-gray-400">Serial Number</span>
                      <p className="text-white font-medium">#{card.serialNumber}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <span className="text-sm text-gray-400">Series</span>
                      <p className="text-white font-medium">{card.series}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {showActions && (
                  <div className="mt-auto">
                    {/* @ts-ignore */}
                    <CardActions card={card} fullWidth />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
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