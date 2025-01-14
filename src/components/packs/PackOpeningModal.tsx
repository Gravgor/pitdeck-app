'use client';

import { useState, useEffect } from 'react';
import { Pack, Card } from '@prisma/client';
import { Loader2, X, Package, Sparkles, Trophy, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '@/utils/sounds';
import Image from 'next/image';
import { CardSelectionGame } from '@/components/packs/CardSelectionGame';

interface PackOpeningModalProps {
  pack: Pack;
  isOpen: boolean;
  onClose: () => void;
}

export function PackOpeningModal({ pack, isOpen, onClose }: PackOpeningModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableCards, setAvailableCards] = useState<Card[]>([]);
  const [showPackAnimation, setShowPackAnimation] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleOpenPack = async () => {
    setShowPackAnimation(true);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/packs/reveal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId: pack.id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      const { cards } = await response.json();
      await new Promise(resolve => setTimeout(resolve, 2500)); // Pack opening animation delay
      setAvailableCards(cards);
      playSound('pack_open');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to open pack');
    } finally {
      setIsLoading(false);
      setShowPackAnimation(false);
    }
  };

  const handleCardsSelected = async (selectedCards: Card[]) => {
    try {
      const response = await fetch('/api/packs/open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          packId: pack.id,
          selectedCardIds: selectedCards.map(card => card.id)
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      playSound('success');
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to claim cards');
    }
  };

  const playSound = (soundName: string) => {
    if (!isMuted) {
      soundManager.play(soundName);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg"
      >
        {error ? (
          <div className="bg-black/80 rounded-xl p-8 border border-red-500/20">
            <div className="text-center">
              <div className="bg-red-500/10 rounded-lg p-6 mb-6">
                <p className="text-red-500 font-display">{error}</p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-red-600 text-white rounded-full font-display tracking-wider hover:bg-red-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : showPackAnimation ? (
          <div className="bg-black/80 rounded-xl p-12 border border-white/10">
            <div className="text-center py-20">
              <motion.div
                animate={{
                  rotateY: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-blue-500 opacity-20 blur-xl animate-pulse" />
                <Package className="h-24 w-24 text-white mx-auto relative z-10" />
              </motion.div>
              <motion.div
                className="mt-8 space-y-2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <p className="text-white font-display tracking-wider text-xl">
                  Opening {pack.name}
                </p>
                <p className="text-gray-400 text-sm">
                  Preparing your cards...
                </p>
              </motion.div>
            </div>
          </div>
        ) : availableCards.length > 0 ? (
          <CardSelectionGame
            availableCards={availableCards}
            packConfig={{
              cardsToSelect: pack.cardsPerPack,
              guaranteedRarities: pack.guaranteedRarities || []
            }}
            onCardsSelected={handleCardsSelected}
          />
        ) : (
          <div className="bg-black/80 rounded-xl p-12 border border-white/10">
            <div className="text-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="mb-12 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-blue-500 opacity-20 blur-xl" />
                <Image 
                  src={pack.imageUrl} 
                  alt={pack.name}
                  className="w-64 h-64 object-cover mx-auto rounded-xl shadow-2xl relative z-10"
                />
              </motion.div>
              <h3 className="text-3xl font-display tracking-wider text-white mb-4 flex items-center justify-center gap-3">
                {pack.name}
                <Trophy className="h-6 w-6 text-yellow-400" />
              </h3>
              <p className="text-gray-400 mb-12 max-w-md mx-auto">{pack.description}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenPack}
                className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 
                         text-white rounded-full font-display tracking-wider uppercase
                         hover:from-red-500 hover:to-red-600 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Open Pack
                  <Star className="h-5 w-5" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 
                              opacity-0 group-hover:opacity-100 blur-xl transition-opacity rounded-full" />
              </motion.button>
              <div className="mt-6 text-sm text-gray-500 font-display tracking-wider">
                Contains {pack.cardsPerPack} cards
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}