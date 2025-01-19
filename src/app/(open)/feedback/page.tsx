'use client';

import { useState } from 'react';
import { MessageSquare, Send, AlertCircle, Link } from 'lucide-react';
import { toast } from 'sonner';

const FEEDBACK_CATEGORIES = [
  'General Feedback',
  'Bug Report',
  'Feature Request',
  'Trading System',
  'Mobile App',
  'Card Collection',
  'Other'
];

export default function FeedbackPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to submit feedback');

      toast.success('Feedback submitted successfully!');
      setFormData({
        name: '',
        email: '',
        category: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/20 to-transparent" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <MessageSquare className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-sm text-white/80">We value your feedback</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Help Us Improve PitDeck
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Share your thoughts, report issues, or suggest new features. Your feedback shapes the future of PitDeck.
            </p>
          </div>
        </div>
      </div>

      {/* Feedback Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300">
              Category
            </label>
            <select
              id="category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="mt-1 block w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {FEEDBACK_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-300">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="mt-1 block w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300">
              Message
            </label>
            <textarea
              id="message"
              required
              rows={6}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="mt-1 block w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  Submit Feedback
                  <Send className="ml-2 h-5 w-5" />
                </>
              )}
            </button>

            <Link
              href="/discord"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-full border border-white/10 text-white hover:bg-white/10 transition-colors"
            >
              Join Discord
            </Link>
          </div>

          <div className="flex items-start gap-2 text-sm text-gray-400">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>
              For urgent issues or bug reports, please join our Discord community for faster response times.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 