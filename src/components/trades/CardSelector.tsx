'use client';

import { Card, Rarity } from '@prisma/client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Search, Filter, Crown, Star } from 'lucide-react';
import { getRarityColor } from '@/lib/utils';

interface CardSelectorProps {
  selectedCards: Card[];
  onSelectCard: (cards: Card[]) => void;
  maxCards?: number;
}

type FilterOptions = {
  rarity: Rarity | 'ALL';
  series: string | 'ALL';
  type: string | 'ALL';
};

export function CardSelector({ selectedCards, onSelectCard, maxCards = 8 }: CardSelectorProps) {
  const [userCards, setUserCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    rarity: 'ALL',
    series: 'ALL',
    type: 'ALL'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchUserCards();
  }, []);

  const fetchUserCards = async () => {
    try {
      const response = await fetch('/api/user/cards');
      const data = await response.json();
      setUserCards(data.cards);
    } catch (error) {
      console.error('Error fetching user cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardSelect = (card: Card) => {
    if (selectedCards.find(c => c.id === card.id)) {
      onSelectCard(selectedCards.filter(c => c.id !== card.id));
    } else if (selectedCards.length < maxCards) {
      onSelectCard([...selectedCards, card]);
    }
  };

  const getUniqueValues = (field: keyof Card) => {
    return Array.from(new Set(userCards.map(card => card[field])));
  };

  const filteredCards = userCards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRarity = filters.rarity === 'ALL' || card.rarity === filters.rarity;
    const matchesSeries = filters.series === 'ALL' || card.series === filters.series;
    const matchesType = filters.type === 'ALL' || card.type === filters.type;
    return matchesSearch && matchesRarity && matchesSeries && matchesType;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-white/10 bg-[#12141A] text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 rounded-lg border border-white/10 bg-[#12141A] text-sm flex items-center gap-2 hover:bg-[#1A1D25] transition-colors"
        >
          <Filter className="h-4 w-4" />
          Filters
        </button>
        <div className="px-4 py-2 rounded-lg bg-[#12141A] border border-white/10 text-sm">
          {selectedCards.length}/{maxCards} selected
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-[#12141A] border border-white/10">
          <div>
            <label className="block text-sm font-medium mb-2">Rarity</label>
            <select
              value={filters.rarity}
              onChange={(e) => setFilters({ ...filters, rarity: e.target.value as Rarity | 'ALL' })}
              className="w-full rounded-lg border border-white/10 bg-[#1A1D25] p-2 text-sm"
            >
              <option value="ALL">All Rarities</option>
              {Object.values(Rarity).map((rarity) => (
                <option key={rarity} value={rarity}>{rarity}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Series</label>
            <select
              value={filters.series}
              onChange={(e) => setFilters({ ...filters, series: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-[#1A1D25] p-2 text-sm"
            >
              <option value="ALL">All Series</option>
              {getUniqueValues('series').map((series) => (
                //@ts-ignore
                <option key={series} value={series}>{series}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-[#1A1D25] p-2 text-sm"
            >
              <option value="ALL">All Types</option>
              {getUniqueValues('type').map((type) => (
                //@ts-ignore
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Selected Cards Preview */}
      {selectedCards.length > 0 && (
        <div className="p-4 rounded-lg bg-[#12141A] border border-white/10">
          <h3 className="text-sm font-medium mb-3">Selected Cards:</h3>
          <div className="flex flex-wrap gap-3">
            {selectedCards.map((card) => (
              <div
                key={card.id}
                className="relative group"
                onClick={() => handleCardSelect(card)}
              >
                <div className="relative w-24 h-32 rounded-lg overflow-hidden">
                  <Image
                    src={card.imageUrl}
                    alt={card.name}
                    fill
                    className="object-cover"
                  />
                  <div className={`absolute inset-0 ${getRarityColor(card.rarity)} opacity-20`} />
                </div>
                <button className="absolute -top-1 -right-1 p-1.5 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3 h-3" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-1">
                  <p className="text-xs text-center truncate">{card.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {filteredCards.map((card) => {
          const isSelected = selectedCards.some(c => c.id === card.id);
          return (
            <div
              key={card.id}
              onClick={() => handleCardSelect(card)}
              className={`relative cursor-pointer transition-transform hover:scale-105 ${
                isSelected ? 'ring-2 ring-blue-500 rounded-lg' : ''
              }`}
            >
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                <Image
                  src={card.imageUrl}
                  alt={card.name}
                  fill
                  className="object-cover"
                />
                <div className={`absolute inset-0 ${getRarityColor(card.rarity)} opacity-20`} />
                
                {/* Rarity Badge */}
                <div className="absolute top-2 right-2">
                  {card.rarity === 'LEGENDARY' && <Crown className="h-4 w-4 text-yellow-400" />}
                  {card.rarity === 'EPIC' && <Star className="h-4 w-4 text-purple-400" />}
                </div>

                {/* Card Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-2">
                  <p className="text-xs font-medium truncate">{card.name}</p>
                  <p className="text-xs text-gray-300">{card.type}</p>
                </div>

                {isSelected && (
                  <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}