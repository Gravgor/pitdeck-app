import { useState, useEffect } from 'react';
import { Card } from '@prisma/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface CardSelectionGameProps {
  availableCards: Card[];
  packConfig: {
    cardsToSelect: number;
    guaranteedRarities: string[];
  };
  onCardsSelected: (selectedCards: Card[]) => void;
}

export function CardSelectionGame({ 
  availableCards, 
  packConfig, 
  onCardsSelected 
}: CardSelectionGameProps) {
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleCardClick = (card: Card) => {
    setError(null);

    if (selectedCards.find(c => c.id === card.id)) {
      setSelectedCards(selectedCards.filter(c => c.id !== card.id));
      return;
    }

    if (selectedCards.length >= packConfig.cardsToSelect) {
      setError(`You can only select ${packConfig.cardsToSelect} cards`);
      return;
    }

    // Check if we need a guaranteed rarity and haven't selected one yet
    const needsGuaranteedRarity = packConfig.guaranteedRarities.some(rarity => {
      const hasRarity = selectedCards.some(c => c.rarity === rarity);
      return !hasRarity;
    });

    if (needsGuaranteedRarity && selectedCards.length === packConfig.cardsToSelect - 1) {
      const hasGuaranteedRarity = packConfig.guaranteedRarities.includes(card.rarity);
      if (!hasGuaranteedRarity) {
        setError('You must select at least one card of guaranteed rarity');
        return;
      }
    }

    setSelectedCards([...selectedCards, card]);
  };

  const handleConfirm = () => {
    // Validate guaranteed rarities
    const missingRarities = packConfig.guaranteedRarities.filter(rarity => 
      !selectedCards.some(card => card.rarity === rarity)
    );

    if (missingRarities.length > 0) {
      setError(`You must select at least one ${missingRarities.join(', ')} card`);
      return;
    }

    if (selectedCards.length !== packConfig.cardsToSelect) {
      setError(`Please select exactly ${packConfig.cardsToSelect} cards`);
      return;
    }

    onCardsSelected(selectedCards);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Select Your Cards
        </h2>
        <p className="text-gray-400">
          Choose {packConfig.cardsToSelect} cards to keep
          {packConfig.guaranteedRarities.length > 0 && (
            <span className="text-yellow-400">
              {' '}(Including {packConfig.guaranteedRarities.join(', ')})
            </span>
          )}
        </p>
        {error && (
          <div className="mt-2 flex items-center justify-center gap-2 text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {availableCards.map((card) => {
          const isSelected = selectedCards.some(c => c.id === card.id);
          
          return (
            <motion.div
              key={card.id}
              className={`relative cursor-pointer group ${
                isSelected ? 'ring-2 ring-green-500' : 'hover:ring-2 hover:ring-white/50'
              } rounded-lg transition-all duration-200`}
              onClick={() => handleCardClick(card)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative aspect-[2/3]">
                <Image
                  src={card.imageUrl}
                  alt={card.name}
                  fill
                  className="rounded-lg object-cover"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-500" />
                  </div>
                )}
              </div>
              <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-medium">
                {card.rarity}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleConfirm}
          disabled={selectedCards.length !== packConfig.cardsToSelect}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 
                   disabled:cursor-not-allowed rounded-lg text-white font-medium 
                   transition-colors duration-200"
        >
          Confirm Selection ({selectedCards.length}/{packConfig.cardsToSelect})
        </button>
      </div>
    </div>
  );
} 