'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';

const FAQ_ITEMS = [
  {
    category: 'Getting Started',
    questions: [
      {
        id: 'what-is-PitDeck',
        question: 'What is PitDeck?',
        answer: 'PitDeck is a digital collectible platform that allows fans to collect, trade, and own unique digital cards featuring motorsport moments, drivers, and vehicles.'
      },
      {
        id: 'how-to-start',
        question: 'How do I get started?',
        answer: 'Getting started is easy! Simply create an account, verify your email, and youll receive your first starter pack. You can then start collecting, trading, and participating in the community.'
      },
      {
        id: 'starter-pack',
        question: 'What comes in a starter pack?',
        answer: 'Each starter pack contains 5 cards of varying rarity, ensuring you get a mix of different card types to begin your collection.'
      }
    ]
  },
  {
    category: 'Cards & Collecting',
    questions: [
      {
        id: 'card-rarity',
        question: 'What are the different card rarities?',
        answer: 'Cards come in four rarity levels: Common, Rare, Epic, and Legendary. Each rarity has unique characteristics and varying levels of scarcity.'
      },
      {
        id: 'card-types',
        question: 'What types of cards are available?',
        answer: 'We offer Driver cards, Vehicle cards, Moment cards (featuring historic racing moments), and Special Edition cards for unique events and collaborations.'
      }
    ]
  },
  {
    category: 'Trading & Marketplace',
    questions: [
      {
        id: 'how-to-trade',
        question: 'How do I trade cards?',
        answer: 'You can trade cards through our marketplace. List your cards for trade, browse other users offerings, and make trade proposals directly through the platform.'
      },
      {
        id: 'card-value',
        question: 'How is card value determined?',
        answer: 'Card value is determined by several factors including rarity, edition number, historical significance, and market demand.'
      }
    ]
  }
];

export function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openQuestions, setOpenQuestions] = useState<string[]>([]);

  const toggleQuestion = (id: string) => {
    setOpenQuestions(prev => 
      prev.includes(id) 
        ? prev.filter(q => q !== id)
        : [...prev, id]
    );
  };

  const filteredFAQ = FAQ_ITEMS.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 via-blue-600/30 to-transparent animate-gradient" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center px-4 py-1.5 rounded-full 
                         border border-white/10 bg-white/5 backdrop-blur-sm">
              <HelpCircle className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-sm text-white/80">Help Center</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500">Questions</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Find answers to common questions about PitDeck. Can't find what you're looking for?
              Visit our help center or contact support.
            </p>
          </motion.div>
        </div>

        {/* Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-xl opacity-0 group-focus-within:opacity-20 transition-opacity blur-xl" />
            <div className="relative">
              <input
                type="text"
                placeholder="Search FAQ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl
                         text-white placeholder:text-gray-500 focus:border-blue-500/50 
                         focus:ring-1 focus:ring-blue-500/50 transition-colors"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </motion.div>

        {/* FAQ Categories */}
        <div className="space-y-6">
          {filteredFAQ.map((category, index) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-2xl opacity-10 blur-xl" />
              <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                <h2 className="text-xl font-semibold text-white p-6 border-b border-white/10">
                  {category.category}
                </h2>
                <div className="divide-y divide-white/10">
                  {category.questions.map((item) => (
                    <div key={item.id} className="p-6">
                      <button
                        onClick={() => toggleQuestion(item.id)}
                        className="w-full flex justify-between items-start text-left group"
                      >
                        <span className="text-white font-medium group-hover:text-red-500 transition-colors">
                          {item.question}
                        </span>
                        <ChevronDown
                          className={`h-5 w-5 text-white/70 transition-transform duration-200
                                    ${openQuestions.includes(item.id) ? 'rotate-180' : ''}`}
                        />
                      </button>
                      <AnimatePresence>
                        {openQuestions.includes(item.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <p className="mt-4 text-gray-400 leading-relaxed">
                              {item.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 