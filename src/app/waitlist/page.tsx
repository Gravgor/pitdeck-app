"use client";

import { useState } from 'react';
import { ArrowLeft, Download, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function WaitlistPage() {
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          platform: 'WEB'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message) {
          throw new Error(Array.isArray(data.message) ? data.message[0] : data.message);
        }
        throw new Error('Failed to join waitlist');
      }

      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
      console.error('Waitlist error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-8">
          <Link 
            href="/"
            className="inline-flex items-center text-white hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="py-12 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl font-bold text-white">
                Join the PitDeck Mobile{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500">
                  Waitlist
                </span>
              </h1>
              
              <p className="text-xl text-gray-400">
                Be among the first to experience the future of motorsport card collecting. Get exclusive rewards and early access when we launch.
              </p>

              {!status || status === 'idle' ? (
                <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full group relative overflow-hidden rounded-lg bg-white px-8 py-4 inline-flex items-center justify-center"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-blue-600 transition-transform duration-300 group-hover:scale-[1.5] animate-slow-spin" />
                    <span className="relative text-black font-medium text-lg">
                      <Download className="mr-2 h-5 w-5 inline-block" />
                      Join Waitlist
                    </span>
                  </button>
                </form>
              ) : status === 'loading' ? (
                <div className="bg-white/5 border border-white/10 rounded-lg p-6 max-w-md">
                  <div className="flex items-center gap-3 text-gray-500 mb-4">
                    <AlertCircle className="h-6 w-6" />
                    <span className="text-lg font-medium">Joining...</span>
                  </div>
                  <p className="text-gray-400">
                    {errorMessage || 'Please wait while we process your request.'}
                  </p>
                </div>
              ) : status === 'success' ? (
                <div className="bg-white/5 border border-white/10 rounded-lg p-6 max-w-md">
                  <div className="flex items-center gap-3 text-green-500 mb-4">
                    <Check className="h-6 w-6" />
                    <span className="text-lg font-medium">Successfully Joined!</span>
                  </div>
                  <p className="text-gray-400">
                    Thank you for joining our waitlist. We'll notify you when PitDeck Mobile is ready for early access.
                  </p>
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-lg p-6 max-w-md">
                  <div className="flex items-center gap-3 text-red-500 mb-4">
                    <AlertCircle className="h-6 w-6" />
                    <span className="text-lg font-medium">Join Error</span>
                  </div>
                  <p className="text-gray-400">
                    {errorMessage}
                  </p>
                </div>
              )}
            </div>

            {/* Right Content - Phone Preview */}
            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-500 to-blue-500 rounded-3xl blur-2xl opacity-20 animate-pulse" />
              <div className="relative aspect-[9/19.5] max-w-[300px] mx-auto">
                <div className="absolute inset-0 bg-black rounded-[2.5rem] p-4 shadow-2xl">
                  <div className="relative h-full w-full bg-[#0A0C10] rounded-[2rem] overflow-hidden">
                    <Image
                      src="/screenshots/collection.png"
                      alt="App Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 