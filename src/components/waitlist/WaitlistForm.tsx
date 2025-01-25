'use client';

import { useState } from 'react';
import { Download, Check, AlertCircle, JoystickIcon } from 'lucide-react';

export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('https://api.pitdeck.app/api/waitlist/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, platform: 'WEB' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(Array.isArray(data.message) ? data.message[0] : data.message);
      }

      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  if (status === 'loading') {
    return (
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 max-w-md backdrop-blur-sm">
        <div className="flex items-center gap-3 text-gray-500 mb-4">
          <AlertCircle className="h-6 w-6 animate-pulse" />
          <span className="text-lg font-medium">Joining...</span>
        </div>
        <p className="text-gray-400">Please wait while we process your request.</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 max-w-md backdrop-blur-sm">
        <div className="flex items-center gap-3 text-green-500 mb-4">
          <Check className="h-6 w-6" />
          <span className="text-lg font-medium">Successfully Joined!</span>
        </div>
        <p className="text-gray-400 mb-4">
          Thank you for joining our waitlist. We'll notify you when PitDeck Mobile is ready for early access.
        </p>
        <a
          href="https://discord.gg/f7jb4Vsf2R"
          target="_blank"
          rel="noopener noreferrer"
          className="relative group inline-block"
        >
          <div className="absolute -inset-0.5 bg-[#5865F2] rounded-lg opacity-50 blur-sm group-hover:opacity-75 transition-opacity" />
          <div className="relative flex items-center justify-center px-6 py-3 bg-[#5865F2] rounded-lg">
            <span className="text-white font-medium flex items-center">
              <JoystickIcon className="mr-2 h-5 w-5" />
              Join our Discord Community
            </span>
          </div>
        </a>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 max-w-md backdrop-blur-sm">
        <div className="flex items-center gap-3 text-red-500 mb-4">
          <AlertCircle className="h-6 w-6" />
          <span className="text-lg font-medium">Join Error</span>
        </div>
        <p className="text-gray-400">{errorMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 space-y-6 max-w-md">
      <div className="group relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-xl opacity-0 group-focus-within:opacity-20 transition-opacity blur-xl" />
        <div className="relative">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white 
                     placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-1 
                     focus:ring-blue-500/50 transition-colors"
            placeholder="Enter your email"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" className="flex-1 relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg opacity-50 blur-sm group-hover:opacity-75 transition-opacity" />
          <div className="relative flex items-center justify-center px-4 py-3 bg-black rounded-lg">
            <span className="text-white font-medium">
              <Download className="mr-2 h-5 w-5 inline-block" />
              Join Waitlist
            </span>
          </div>
        </button>

        <a
          href="https://discord.gg/f7jb4Vsf2R"
          target="_blank"
          rel="noopener noreferrer"
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-[#5865F2] rounded-lg opacity-50 blur-sm group-hover:opacity-75 transition-opacity" />
          <div className="relative flex items-center justify-center px-6 py-3 bg-[#5865F2] rounded-lg">
            <JoystickIcon className="h-5 w-5 text-white" />
          </div>
        </a>
      </div>
    </form>
  );
} 