'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface HelpArticleProps {
  article: {
    title: string;
    content: string;
  };
  onBack: () => void;
}

export function HelpArticle({ article, onBack }: HelpArticleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-white/70 hover:text-white mb-6
                   transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Help Center
      </button>
      
      <div className="bg-[#12141A] rounded-xl p-8 border border-white/5">
        <h1 className="text-2xl font-bold text-white mb-6">{article.title}</h1>
        <div className="prose prose-invert max-w-none">
          {article.content}
        </div>
      </div>
    </motion.div>
  );
} 