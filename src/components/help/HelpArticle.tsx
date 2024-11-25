'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface HelpArticleProps {
  article: {
    title: string;
    content: string;
    isMarkdown?: boolean;
  };
  onBack: () => void;
}

export function HelpArticle({ article, onBack }: HelpArticleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
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
        <div className="prose prose-invert prose-headings:text-white prose-h2:text-xl 
                      prose-h3:text-lg prose-strong:text-white/90 prose-em:text-white/80 
                      prose-code:text-blue-400 prose-ul:space-y-1 max-w-none">
          {article.isMarkdown ? (
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                // Custom components for markdown elements
                h2: ({ children }) => (
                  <h2 className="text-xl font-semibold text-white mt-8 mb-4">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-medium text-white/90 mt-6 mb-3">{children}</h3>
                ),
                ul: ({ children }) => (
                  <ul className="space-y-2 text-white/80">{children}</ul>
                ),
                li: ({ children }) => (
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5">•</span>
                    <span>{children}</span>
                  </li>
                ),
                p: ({ children }) => (
                  <p className="text-white/80 mb-4">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="text-white font-semibold">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="text-white/90 not-italic font-medium">{children}</em>
                ),
              }}
            >
              {article.content}
            </ReactMarkdown>
          ) : (
            <div>{article.content}</div>
          )}
        </div>
      </div>
    </motion.div>
  );
} 