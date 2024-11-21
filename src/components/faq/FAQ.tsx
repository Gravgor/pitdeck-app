'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';

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
    <div className="min-h-screen bg-[#0A0C10] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Find answers to common questions about PitDeck. Can't find what you're looking for?
              Visit our help center or contact support.
            </p>
          </motion.div>
        </div>

        {/* Search */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search FAQ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl
                       text-white placeholder-white/50 focus:outline-none focus:ring-2
                       focus:ring-red-500/50"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50" />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredFAQ.map((category) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#12141A] rounded-xl border border-white/5 overflow-hidden"
            >
              <h2 className="text-xl font-semibold text-white p-6 border-b border-white/5">
                {category.category}
              </h2>
              <div className="divide-y divide-white/5">
                {category.questions.map((item) => (
                  <div key={item.id} className="p-6">
                    <button
                      onClick={() => toggleQuestion(item.id)}
                      className="w-full flex justify-between items-start text-left"
                    >
                      <span className="text-white font-medium">{item.question}</span>
                      <ChevronDown
                        className={`h-5 w-5 text-white/70 transition-transform
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
                          <p className="mt-4 text-gray-400">{item.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 