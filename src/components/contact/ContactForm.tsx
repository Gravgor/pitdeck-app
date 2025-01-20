'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Send, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

type ContactCategory = 'general' | 'technical' | 'billing' | 'partnership';

interface ContactFormData {
  name: string;
  email: string;
  category: ContactCategory;
  subject: string;
  message: string;
}

const CATEGORIES = [
  { id: 'general', label: 'General Inquiry', description: 'General questions about PitDeck', icon: MessageCircle },
  { id: 'technical', label: 'Technical Support', description: 'Help with technical issues', icon: AlertCircle },
  { id: 'billing', label: 'Billing Support', description: 'Questions about payments', icon: Mail },
  { id: 'partnership', label: 'Partnership', description: 'Business and partnership opportunities', icon: Sparkles },
] as const;

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    category: 'general',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to send message');

      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        category: 'general',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error('Contact form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 via-blue-600/30 to-transparent animate-gradient" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center px-4 py-1.5 rounded-full 
                         border border-white/10 bg-white/5 backdrop-blur-sm">
              <MessageCircle className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-sm text-white/80">Get in Touch</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500">help you?</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Have a question or need help? We're here for you. Fill out the form below
              and we'll get back to you as soon as possible.
            </p>
          </motion.div>
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-2xl opacity-20 blur-xl" />
            <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-xl opacity-0 group-focus-within:opacity-20 transition-opacity blur-xl" />
                    <div className="relative">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white 
                                 placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-1 
                                 focus:ring-blue-500/50 transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                  </div>

                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-xl opacity-0 group-focus-within:opacity-20 transition-opacity blur-xl" />
                    <div className="relative">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white 
                                 placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-1 
                                 focus:ring-blue-500/50 transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Category
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {CATEGORIES.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: category.id as ContactCategory })}
                          className={`p-4 rounded-lg border backdrop-blur-sm transition-all
                                    ${formData.category === category.id
                                      ? 'bg-white/10 border-red-500/50 text-white'
                                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                                    }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`h-5 w-5 ${formData.category === category.id ? 'text-red-500' : 'text-gray-400'}`} />
                            <div>
                              <div className="font-medium text-left">{category.label}</div>
                              <div className="text-sm opacity-70 text-left">{category.description}</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Subject */}
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-xl opacity-0 group-focus-within:opacity-20 transition-opacity blur-xl" />
                  <div className="relative">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white 
                               placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-1 
                               focus:ring-blue-500/50 transition-colors"
                      placeholder="What's your message about?"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-xl opacity-0 group-focus-within:opacity-20 transition-opacity blur-xl" />
                  <div className="relative">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1.5">
                      Message
                    </label>
                    <textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white 
                               placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-1 
                               focus:ring-blue-500/50 transition-colors resize-none"
                      placeholder="Tell us how we can help..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative w-full group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg 
                                opacity-50 blur-sm group-hover:opacity-75 transition-opacity" />
                  <div className="relative flex items-center justify-center px-4 py-3 bg-black rounded-lg">
                    {isSubmitting ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        <span className="text-white font-medium">Sending...</span>
                      </>
                    ) : (
                      <span className="text-white font-medium flex items-center">
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </span>
                    )}
                  </div>
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 