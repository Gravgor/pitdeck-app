'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Crown, Star, Trophy, Medal } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface CardProps {
  id: string;
  name: string;
  type: string;
  rarity: 'LEGENDARY' | 'EPIC' | 'RARE' | 'COMMON';
  imageUrl: string;
  description?: string | null;
  stats?: any;
  edition?: string | null;
  serialNumber?: string | null;
  owner?: {
    name: string | null;
    image: string | null;
  } | null;
}

function isSpecialSerial(serialNumber?: string | null): boolean {
  if (!serialNumber) return false;
  const num = parseInt(serialNumber);
  return num >= 1 && num <= 5;
}

function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
}

export function Card({ 
  name, 
  type, 
  rarity, 
  imageUrl, 
  description, 
  stats, 
  serialNumber,
  owner 
}: CardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group relative aspect-[2/3] sm:aspect-[2/3] rounded-lg sm:rounded-xl overflow-hidden 
                 ${getRarityBorder(rarity)}
                 hover:scale-105 hover:shadow-2xl transition-all duration-300`}
    >
      {/* Top badges container */}
      <div className="absolute top-0 left-0 right-0 z-30 p-2 sm:p-3 flex justify-between items-start">
        {/* Available/Owner badge */}
        {owner ? (
          <div className="flex items-center gap-1.5 sm:gap-2 bg-black/50 backdrop-blur-sm rounded-full pl-1 pr-2 sm:pr-3 py-0.5 sm:py-1">
            {owner.image ? (
              <Image
                src={owner.image}
                alt={owner.name || 'Owner'}
                width={20}
                height={20}
                className="rounded-full w-5 h-5 sm:w-6 sm:h-6"
              />
            ) : (
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-[10px] sm:text-xs text-white">
                  {owner.name?.[0]?.toUpperCase() || '?'}
                </span>
              </div>
            )}
            <span className="text-[10px] sm:text-xs text-white/90 truncate max-w-[80px] sm:max-w-[100px]">
              {owner.name || 'Anonymous'}
            </span>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-500 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg"
          >
            <span className="text-[10px] sm:text-xs font-medium text-white">Available</span>
          </motion.div>
        )}

        {/* Rarity Badge */}
        <div className={`${getRarityBadgeStyle(rarity)} scale-75 sm:scale-100`}>
          {getRarityIcon(rarity)}
        </div>
      </div>

      {/* Card Image */}
      <div className="relative w-full h-full">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Content Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          {/* Card Content */}
          <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-4 pt-8 sm:pt-12">
            {/* Type and Rarity Tags */}
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium uppercase tracking-wider 
                            ${getRarityTagStyle(rarity)}`}>
                {rarity}
              </span>
              <span className="text-[10px] sm:text-xs text-white/80">{type.replace(/_/g, ' ')}</span>
            </div>

            {/* Title */}
            <h3 className="text-white font-medium tracking-wide text-base sm:text-lg mb-1.5 sm:mb-2">{name}</h3>

            {/* Description - Hidden on mobile unless touched */}
            <p className="text-xs sm:text-sm text-white/80 mb-2 sm:mb-3 line-clamp-2 hidden sm:block">
              {description}
            </p>

            {/* Availability Status */}
            {!owner && (
              <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
                <span className="text-emerald-400">Available to Collect</span>
                <Link 
                  href="/auth/signin" 
                  className="text-white/90 hover:text-white underline decoration-dotted"
                >
                  Sign in to collect
                </Link>
              </div>
            )}

            {/* Serial Number */}
            {serialNumber && (
              <p className={`text-[10px] sm:text-xs ${
                isSpecialSerial(serialNumber)
                  ? 'text-yellow-400 font-semibold'
                  : 'text-white/60'
              } mt-1.5 sm:mt-2`}>
                #{serialNumber}
                {isSpecialSerial(serialNumber) && (
                  <span className="ml-1 text-yellow-500">
                    {parseInt(serialNumber)}
                    {getOrdinalSuffix(parseInt(serialNumber))} Mint
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function getRarityIcon(rarity: CardProps['rarity']) {
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

function getRarityBorder(rarity: CardProps['rarity']): string {
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

function getRarityOverlay(rarity: CardProps['rarity']): string {
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

function getRarityBadgeStyle(rarity: CardProps['rarity']): string {
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

function getRarityTagStyle(rarity: CardProps['rarity']): string {
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

function getStatBarColor(rarity: CardProps['rarity']): string {
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