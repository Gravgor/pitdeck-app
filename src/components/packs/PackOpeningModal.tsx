'use client';

import { useState, useEffect } from 'react';
import { Pack, Card } from '@prisma/client';
import { Loader2, X, Package, Sparkles, Trophy, Star, ShareIcon, Volume2, VolumeX } from 'lucide-react';
import { CardReveal } from './CardReveal';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { soundManager } from '@/utils/sounds';
import Image from 'next/image';


interface PackOpeningModalProps {
  pack: Pack;
  isOpen: boolean;
  onClose: () => void;
}

export function PackOpeningModal({ pack, isOpen, onClose }: PackOpeningModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [revealIndex, setRevealIndex] = useState(-1);
  const [showPackAnimation, setShowPackAnimation] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

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

  const triggerConfetti = (rarity: string = 'COMMON') => {
    const colors = {
      LEGENDARY: ['#FFD700', '#FFA500'],
      EPIC: ['#9B59B6', '#8E44AD'],
      RARE: ['#3498DB', '#2980B9'],
      COMMON: ['#BDC3C7', '#95A5A6']
    };
    
    confetti({
      particleCount: rarity === 'LEGENDARY' ? 150 : 100,
      spread: rarity === 'LEGENDARY' ? 90 : 70,
      colors: colors[rarity as keyof typeof colors],
      origin: { y: 0.6 }
    });
  };

  const handleOpenPack = async () => {
    setShowPackAnimation(true);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/packs/open', {
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
      setCards(cards);
      setRevealIndex(0);
      triggerConfetti();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to open pack');
    } finally {
      setIsLoading(false);
      setShowPackAnimation(false);
    }
  };

  const handleNextCard = () => {
    if (revealIndex < cards.length - 1) {
      setRevealIndex(revealIndex + 1);
      if (cards[revealIndex + 1]) {
        triggerConfetti(cards[revealIndex + 1].rarity);
      }
    } else {
      onClose();
    }
  };

  const playSound = (soundName: string) => {
    if (!isMuted) {
      soundManager.play(soundName);
    }
  };

  const getRarityEffects = (rarity: string) => {
    switch (rarity) {
      case 'LEGENDARY':
        return {
          glow: 'animate-pulse shadow-[0_0_50px_-5px_rgba(255,215,0,0.7)]',
          border: 'border-yellow-400/50',
          animation: 'animate-legendary',
        };
      case 'EPIC':
        return {
          glow: 'animate-pulse shadow-[0_0_40px_-5px_rgba(147,51,234,0.7)]',
          border: 'border-purple-400/50',
          animation: 'animate-epic',
        };
      case 'RARE':
        return {
          glow: 'animate-pulse shadow-[0_0_30px_-5px_rgba(59,130,246,0.7)]',
          border: 'border-blue-400/50',
          animation: 'animate-rare',
        };
      default:
        return {
          glow: '',
          border: 'border-gray-400/50',
          animation: '',
        };
    }
  };

  const handleShare = async (platform: string) => {
    const shareData = {
      title: `Check out my ${pack.name} pack opening!`,
      text: `I just opened a ${pack.name} pack on PitDeck and got some amazing cards!`,
      url: window.location.href,
    };

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`);
        break;
      case 'native':
        try {
          await navigator.share(shareData);
        } catch (err) {
          console.error('Error sharing:', err);
        }
        break;
    }
  };

  const PackOpeningAnimation = () => (
    <motion.div
      className="relative w-64 h-64 mx-auto"
      animate={{
        rotateY: [0, 360],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 2.5,
        ease: "easeInOut",
      }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0, 1, 0],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-blue-500 to-yellow-500 opacity-20 blur-2xl" />
      </motion.div>
      
      <motion.div
        className="relative z-10"
        animate={{
          rotateZ: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        <Image
          src={pack.imageUrl}
          alt={pack.name}
          className="w-full h-full object-cover rounded-xl shadow-2xl"
        />
      </motion.div>
    </motion.div>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg"
      >
        <button
          onClick={() => {
            setIsMuted(!isMuted);
            soundManager.setMuted(!isMuted);
          }}
          className="absolute top-4 left-4 p-2 text-gray-400 hover:text-white transition-colors"
        >
          {isMuted ? (
            <VolumeX className="h-6 w-6" />
          ) : (
            <Volume2 className="h-6 w-6" />
          )}
        </button>

        <button
          onClick={() => setShowShareMenu(!showShareMenu)}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
        >
          <ShareIcon className="h-6 w-6" />
        </button>

        <AnimatePresence>
          {showShareMenu && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-16 right-4 bg-black/90 rounded-xl border border-white/10 p-4"
            >
              <div className="space-y-2">
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-full px-4 py-2 text-left hover:bg-white/10 rounded-lg transition-colors"
                >
                  Share on Twitter
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="w-full px-4 py-2 text-left hover:bg-white/10 rounded-lg transition-colors"
                >
                  Share on Facebook
                </button>
                
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-3xl mx-4"
        >
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 text-gray-400 hover:text-white transition-colors z-50"
          >
            <X className="h-6 w-6" />
          </button>

          {error ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-black/80 rounded-xl p-8 border border-red-500/20"
            >
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
            </motion.div>
          ) : showPackAnimation ? (
            <motion.div
              className="bg-black/80 rounded-xl p-12 border border-white/10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
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
            </motion.div>
          ) : cards.length > 0 ? (
            <div className="relative">
              <div className="absolute -top-12 left-0 right-0 flex justify-center">
                <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
                  <p className="text-white font-display tracking-wider text-sm">
                    Card {revealIndex + 1} of {cards.length}
                  </p>
                </div>
              </div>
              <CardReveal
                //@ts-ignore
                card={cards[revealIndex]}
                onNext={handleNextCard}
                isLast={revealIndex === cards.length - 1}
              />
            </div>
          ) : (
            <motion.div
              className="bg-black/80 rounded-xl p-12 border border-white/10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
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
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}