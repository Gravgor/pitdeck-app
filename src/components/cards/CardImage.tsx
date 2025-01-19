'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Card } from '@prisma/client';

interface CardImageProps {
  card: Card;
  className?: string;
  priority?: boolean;
  showRarity?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const rarityGradients = {
  COMMON: 'from-gray-400/20 to-gray-600/20',
  RARE: 'from-blue-400/20 to-blue-600/20',
  EPIC: 'from-purple-400/20 to-purple-600/20',
  LEGENDARY: 'from-yellow-400/20 to-yellow-600/20',
  MYTHIC: 'from-red-400/20 to-red-600/20'
};

const rarityBorders = {
  COMMON: 'border-gray-400/50',
  RARE: 'border-blue-400/50',
  EPIC: 'border-purple-400/50',
  LEGENDARY: 'border-yellow-400/50',
  MYTHIC: 'border-red-400/50'
};

export function CardImage({ 
  card, 
  className, 
  priority = false,
  showRarity = true,
  size = 'md'
}: CardImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const sizeClasses = {
    sm: 'aspect-[2/3] w-24',
    md: 'aspect-[2/3] w-36',
    lg: 'aspect-[2/3] w-48'
  };

  const handleError = () => {
    setError(true);
    setIsLoading(false);
  };

  return (
    <div className={cn(
      'relative rounded-lg overflow-hidden',
      sizeClasses[size],
      showRarity && `border-2 ${rarityBorders[card.rarity]}`,
      className
    )}>
      {/* Loading Skeleton */}
      {isLoading && !error && (
        <div className={cn(
          'absolute inset-0 animate-pulse',
          `bg-gradient-to-b ${rarityGradients[card.rarity]}`
        )} />
      )}

      {/* Fallback for Error */}
      {error && (
        <div className={cn(
          'absolute inset-0 flex items-center justify-center',
          `bg-gradient-to-b ${rarityGradients[card.rarity]}`
        )}>
          <div className="text-center p-2">
            <p className="text-xs text-white/80">{card.name}</p>
          </div>
        </div>
      )}

      {/* Card Image */}
      {card.imageUrl && (
        <Image
          src={card.imageUrl}
          alt={card.name}
          fill
          className={cn(
            'object-cover transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
          onLoad={() => setIsLoading(false)}
          onError={handleError}
          priority={priority}
          sizes={`(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw`}
        />
      )}

      {/* Rarity Indicator */}
      {showRarity && (
        <div className={cn(
          'absolute bottom-0 left-0 right-0',
          'h-1/4 bg-gradient-to-t from-black/80 to-transparent'
        )}>
          <div className="absolute bottom-2 left-2">
            <div className={cn(
              'px-2 py-0.5 rounded-full text-xs font-medium',
              'bg-black/50 backdrop-blur-sm',
              {
                'text-gray-300': card.rarity === 'COMMON',
                'text-blue-300': card.rarity === 'RARE',
                'text-purple-300': card.rarity === 'EPIC',
                'text-yellow-300': card.rarity === 'LEGENDARY',
              }
            )}>
              {card.rarity.charAt(0) + card.rarity.slice(1).toLowerCase()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 