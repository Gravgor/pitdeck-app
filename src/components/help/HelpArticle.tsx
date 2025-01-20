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
        className="group relative overflow-hidden rounded-full bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 inline-flex items-center hover:bg-white/10 transition-colors mb-8"
      >
        <span className="relative text-white/80 text-sm flex items-center group-hover:text-white">
          <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Help Center
        </span>
      </button>
      
      <div className="group relative">
        <div className="absolute -inset-px bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-10 blur-xl" />
        <div className="relative bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
          <h1 className="text-3xl font-bold text-white mb-8">{article.title}</h1>
          <div className="prose prose-invert prose-headings:text-white prose-h2:text-2xl 
                        prose-h3:text-xl prose-strong:text-white/90 prose-em:text-white/80 
                        prose-code:text-blue-400 prose-ul:space-y-2 max-w-none">
            {article.isMarkdown ? (
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-semibold text-white mt-12 mb-6">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-medium text-white/90 mt-8 mb-4">{children}</h3>
                  ),
                  ul: ({ children }) => (
                    <ul className="space-y-3 text-white/80">{children}</ul>
                  ),
                  li: ({ children }) => (
                    <li className="flex items-start gap-3 bg-white/5 rounded-lg p-4 border border-white/10">
                      <span className="mt-1.5 text-blue-500">•</span>
                      <span>{children}</span>
                    </li>
                  ),
                  p: ({ children }) => (
                    <p className="text-white/80 mb-6 leading-relaxed">{children}</p>
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
              <div className="text-white/80 leading-relaxed">{article.content}</div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 