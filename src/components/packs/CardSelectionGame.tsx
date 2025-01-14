import { useState, useEffect } from 'react';
import { Card } from '@prisma/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, ShieldQuestion, Loader2, PartyPopper, Trophy } from 'lucide-react';
import Image from 'next/image';
import confetti from 'canvas-confetti';

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
  const [revealedCards, setRevealedCards] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleCardClick = (card: Card) => {
    setError(null);

    if (selectedCards.some(c => c.id === card.id)) {
        return;
      }

    // Check if we can reveal more cards
    if (selectedCards.length >= packConfig.cardsToSelect) {
      setError(`You can only select ${packConfig.cardsToSelect} cards`);
      return;
    }

    // Check guaranteed rarity requirements
    if (selectedCards.length === packConfig.cardsToSelect - 1) {
      const hasRequiredRarity = packConfig.guaranteedRarities.some(rarity => {
        const existingCard = selectedCards.find(c => c.rarity === rarity);
        return existingCard || card.rarity === rarity;
      });

      if (!hasRequiredRarity) {
        setError(`You must select at least one ${packConfig.guaranteedRarities.join(' or ')} card`);
        return;
      }
    }

    // Reveal and automatically select the card
    setRevealedCards([...revealedCards, card.id]);
    setSelectedCards([...selectedCards, card]);
    playRevealSound();
  };

  const playRevealSound = () => {
    // TODO: Add sound manager
    // soundManager.play('card_reveal');
  };

  const handleConfirm = async () => {
    setShowConfirmation(true);
  };

  const handleFinalConfirm = async () => {
    setIsConfirming(true);
    try {
      await onCardsSelected(selectedCards);
      setShowConfirmation(false);
      setShowSuccess(true);
      triggerConfetti();
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000); // Hide success message after 3 seconds
    } catch (error) {
      setError('Failed to process selection. Please try again.');
      setIsConfirming(false);
      setShowConfirmation(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 relative">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Mystery Pack Opening
        </h2>
        <p className="text-gray-400">
          Reveal {packConfig.cardsToSelect} cards to keep
          {packConfig.guaranteedRarities.length > 0 && (
            <span className="text-yellow-400">
              {' '}(Must include {packConfig.guaranteedRarities.join(' or ')})
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {availableCards.map((card) => {
          const isSelected = selectedCards.some(c => c.id === card.id);
          const isRevealed = revealedCards.includes(card.id);
          
          return (
            <motion.div
              key={card.id}
              className={`relative cursor-pointer group ${
                isSelected ? 'ring-2 ring-green-500' : 
                isRevealed ? 'ring-1 ring-white/20' : 'ring-1 ring-white/10'
              } rounded-lg transition-all duration-200`}
              onClick={() => handleCardClick(card)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative aspect-[2/3]">
                {isRevealed ? (
                  <>
                    <Image
                      src={card.imageUrl}
                      alt={card.name}
                      fill
                      className="rounded-lg object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2 rounded-b-lg">
                      <p className="text-xs font-medium text-white truncate">{card.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-400">{card.type.replace('_', ' ')}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          getRarityColor(card.rarity)
                        }`}>
                          {card.rarity}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <Check className="h-8 w-8 text-green-500" />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                    <ShieldQuestion className="h-12 w-12 text-white/20" />
                    <div className="absolute inset-0 bg-black/20 rounded-lg backdrop-blur-sm" />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="text-center p-6"
            >
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 0.5 }}
                className="inline-block mb-4"
              >
                <PartyPopper className="h-16 w-16 text-yellow-400" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Awesome Collection!
              </h2>
              <p className="text-gray-400 mb-8">
                Your cards have been added to your collection
              </p>
              <div className="grid grid-cols-5 gap-3 mb-6">
                {selectedCards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative aspect-[2/3] rounded-lg overflow-hidden"
                  >
                    <Image
                      src={card.imageUrl}
                      alt={card.name}
                      fill
                      className="object-cover"
                    />
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                    >
                      <div className="absolute bottom-2 left-2 right-2">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${getRarityColor(card.rarity)}`}>
                          {card.rarity}
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <button
                  onClick={() => setShowSuccess(false)}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 
                           rounded-lg text-white font-medium transition-colors"
                >
                  Continue
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-xl p-6 max-w-lg w-full mx-4 border border-white/10"
            >
              <h3 className="text-xl font-bold text-white mb-4">
                Confirm Your Selection
              </h3>
              
              <div className="grid grid-cols-5 gap-2 mb-6">
                {selectedCards.map((card) => (
                  <div key={card.id} className="relative aspect-[2/3] rounded-lg overflow-hidden">
                    <Image
                      src={card.imageUrl}
                      alt={card.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-1">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${getRarityColor(card.rarity)}`}>
                        {card.rarity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleFinalConfirm}
                  disabled={isConfirming}
                  className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 
                           disabled:bg-green-500/50 rounded-lg text-white font-medium 
                           transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isConfirming ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Confirm Selection'
                  )}
                </button>
                
                <button
                  onClick={() => setShowConfirmation(false)}
                  disabled={isConfirming}
                  className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 
                           disabled:bg-gray-800/50 rounded-lg text-white font-medium 
                           transition-colors duration-200"
                >
                  Go Back
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 flex flex-col items-center gap-2">
        <button
          onClick={handleConfirm}
          disabled={selectedCards.length !== packConfig.cardsToSelect}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 
                   disabled:cursor-not-allowed rounded-lg text-white font-medium 
                   transition-colors duration-200"
        >
          Confirm Selection ({selectedCards.length}/{packConfig.cardsToSelect})
        </button>
        {selectedCards.length > 0 && !showConfirmation && (
          <button
            onClick={() => {
              setSelectedCards([]);
              setRevealedCards([]);
              setError(null);
            }}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Reset Selection
          </button>
        )}
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