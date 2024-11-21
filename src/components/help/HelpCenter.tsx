'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronRight, Package, Wallet, Users, Trophy, Star, HelpCircle } from 'lucide-react';
import { HelpArticle } from './HelpArticle';
const HELP_CATEGORIES = [
  {
    id: 'getting-started',
    icon: Star,
    title: 'Getting Started',
    description: 'New to PitDeck? Learn the basics here.',
    articles: [
      {
        id: 'what-is-PitDeck',
        title: 'What is PitDeck?',
        content: 'PitDeck is a digital collectible platform...'
      },
      {
        id: 'how-to-start',
        title: 'How to get started?',
        content: 'Create an account and get your first pack...'
      }
    ]
  },
  {
    id: 'packs-cards',
    icon: Package,
    title: 'Packs & Cards',
    description: 'Learn about different card types and packs.',
    articles: [
      {
        id: 'card-types',
        title: 'Card Types & Rarity',
        content: 'Understand different card types and rarity levels...'
      },
      {
        id: 'pack-types',
        title: 'Pack Types',
        content: 'Explore different pack options...'
      }
    ]
  },
  // Add more categories...
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  const filteredCategories = HELP_CATEGORIES.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.articles.some(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-[#0A0C10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">How can we help?</h1>
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl
                         text-white placeholder-white/50 focus:outline-none focus:ring-2
                         focus:ring-red-500/50"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50" />
          </div>
        </div>

        {selectedArticle ? (
          <HelpArticle
            article={HELP_CATEGORIES
              .flatMap(cat => cat.articles)
              .find(art => art.id === selectedArticle)!}
            onBack={() => setSelectedArticle(null)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#12141A] rounded-xl p-6 border border-white/5"
              >
                <category.icon className="h-8 w-8 text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">{category.title}</h2>
                <p className="text-gray-400 mb-6">{category.description}</p>
                
                <div className="space-y-2">
                  {category.articles.map((article) => (
                    <button
                      key={article.id}
                      onClick={() => setSelectedArticle(article.id)}
                      className="w-full flex items-center justify-between p-3 rounded-lg
                               bg-white/5 hover:bg-white/10 transition-colors group"
                    >
                      <span className="text-white/80 group-hover:text-white">
                        {article.title}
                      </span>
                      <ChevronRight className="h-4 w-4 text-white/50 group-hover:text-white" />
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 