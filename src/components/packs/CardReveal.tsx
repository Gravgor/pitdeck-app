'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trophy, Sparkles, ArrowRight } from 'lucide-react';
import { soundManager } from '@/utils/sounds';
import Image from 'next/image';

interface CardRevealProps {
  card: {
    id: string;
    name: string;
    imageUrl: string;
    rarity: 'LEGENDARY' | 'EPIC' | 'RARE' | 'COMMON';
    type: string;
    series: string;
    year: number;
    team?: string;
    driver?: string;
    circuit?: string;
    stats: {
      speed?: number;
      control?: number;
      power?: number;
      experience?: number;
      // Add any other relevant stats
    };
  };
  onNext: () => void;
  isLast: boolean;
}

export function CardReveal({ card, onNext, isLast }: CardRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [showRarityEffect, setShowRarityEffect] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const rarityConfig = {
    LEGENDARY: {
      color: 'from-yellow-500 to-orange-500',
      glow: 'shadow-[0_0_50px_rgba(234,179,8,0.5)]',
      icon: Trophy,
      sound: 'legendary',
      particles: 150,
      text: 'text-yellow-400',
      border: 'border-yellow-400/50',
      gradient: 'from-yellow-400/20 via-yellow-400/10 to-transparent',
    },
    EPIC: {
      color: 'from-purple-500 to-pink-500',
      glow: 'shadow-[0_0_40px_rgba(168,85,247,0.5)]',
      icon: Star,
      sound: 'epic',
      particles: 100,
      text: 'text-purple-400',
      border: 'border-purple-400/50',
      gradient: 'from-purple-400/20 via-purple-400/10 to-transparent',
    },
    RARE: {
      color: 'from-blue-500 to-cyan-500',
      glow: 'shadow-[0_0_30px_rgba(59,130,246,0.5)]',
      icon: Sparkles,
      sound: 'rare',
      particles: 75,
      text: 'text-blue-400',
      border: 'border-blue-400/50',
      gradient: 'from-blue-400/20 via-blue-400/10 to-transparent',
    },
    COMMON: {
      color: 'from-gray-500 to-gray-400',
      glow: 'shadow-[0_0_20px_rgba(156,163,175,0.5)]',
      icon: Star,
      sound: 'common',
      particles: 50,
      text: 'text-gray-400',
      border: 'border-gray-400/50',
      gradient: 'from-gray-400/20 via-gray-400/10 to-transparent',
    },
  };

  const config = rarityConfig[card.rarity];
  const RarityIcon = config.icon;

  useEffect(() => {
    if (showRarityEffect) {
      // Play rarity-specific sound
      const raritySound = card.rarity.toLowerCase();
      soundManager.play(raritySound);
    }
  }, [showRarityEffect, card.rarity]);

  const handleReveal = () => {
    if (!isRevealed) {
      // Play card flip sound
      soundManager.play('cardFlip');
      setIsRevealed(true);
      setTimeout(() => {
        setShowRarityEffect(true);
      }, 600);
    }
  };

  const handleNextClick = () => {
    soundManager.play('buttonClick');
    onNext();
  };

  const handleCardHover = () => {
    if (!isRevealed && !isHovering) {
      soundManager.play('cardHover');
      setIsHovering(true);
    }
  };

  const handleCardLeave = () => {
    setIsHovering(false);
  };

  return (
    <div className="relative">
      {/* Background Effects */}
      <AnimatePresence>
        {showRarityEffect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 -z-10"
          >
            <div className={`absolute inset-0 bg-gradient-radial ${config.gradient} blur-3xl`} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Container */}
      <motion.div
        className="relative mx-auto w-[300px] h-[420px] [transform-style:preserve-3d]"
        initial={false}
        animate={isRevealed ? { rotateY: 180 } : { rotateY: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Card Back */}
        <motion.div
          className={`absolute inset-0 [backface-visibility:hidden] cursor-pointer
            bg-gradient-to-br ${config.color} rounded-xl ${config.glow}
            border ${config.border} transform transition-transform duration-500
            hover:scale-105 transition-all duration-300`}
          onClick={handleReveal}
          onMouseEnter={handleCardHover}
          onMouseLeave={handleCardLeave}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Trophy className="w-20 h-20 text-white/80" />
            </motion.div>
            {!isRevealed && (
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-6 text-white/80 font-display tracking-wider text-sm"
              >
                Click to Reveal
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Card Front - update background styling */}
        <motion.div
          className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]
            bg-gradient-to-br ${config.color} rounded-xl ${config.glow}
            border ${config.border}`}
        >
          <div className="relative h-full p-4 flex flex-col bg-black/80 rounded-xl">
            {/* Card Header */}
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xl font-display tracking-wider text-white">
                  {card.name}
                </h3>
                <p className="text-sm text-gray-400">
                  {card.series} • {card.year}
                </p>
              </div>
              <div className={`flex items-center gap-1 ${config.text} px-2 py-1 rounded-full bg-white/5`}>
                <RarityIcon className="h-4 w-4" />
                <span className="text-xs font-display tracking-wider">
                  {card.rarity}
                </span>
              </div>
            </div>

            {/* Card Image */}
            <div className="relative flex-1 mb-4 rounded-lg overflow-hidden">
              <Image
                src={card.imageUrl}
                alt={card.name}
                fill
                className="object-cover"
                priority
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${config.gradient} opacity-30`} />
            </div>

            {/* Card Details */}
            <div className="space-y-3">
              {/* Type & Team/Driver/Circuit Info */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{card.type}</span>
                <span className="text-white">
                  {card.driver || card.team || card.circuit}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2">
                {card.stats && Object.entries(card.stats).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-white/5 rounded-lg p-2"
                  >
                    <div className="text-xs text-gray-400 capitalize">
                      {key}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${value}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className={`h-full bg-gradient-to-r ${config.color}`}
                        />
                      </div>
                      <span className="text-sm font-display text-white">
                        {value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Next Button */}
      <AnimatePresence>
        {isRevealed && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={handleNextClick}
            onMouseEnter={() => soundManager.play('cardHover')}
            className={`absolute -bottom-20 left-1/2 -translate-x-1/2 
              px-6 py-3 bg-gradient-to-r ${config.color} 
              rounded-full font-display tracking-wider text-white
              hover:scale-105 transition-transform flex items-center gap-2`}
          >
            {isLast ? 'Finish' : 'Next Card'}
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}