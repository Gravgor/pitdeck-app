'use client';

import { useState } from 'react';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.pitdeck.app/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send reset email');
      }

      setIsSuccess(true);
      toast.success('Reset instructions sent to your email');
    } catch (error) {
      toast.error('Failed to send reset email. Please try again.');
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

      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link 
              href="/auth/login"
              className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">
              Reset your password
            </h1>
            <p className="text-gray-400">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>

          {!isSuccess ? (
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-2xl opacity-20 blur-xl" />
              <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-xl opacity-0 group-focus-within:opacity-20 transition-opacity blur-xl" />
                    <div className="relative">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white 
                                 placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-1 
                                 focus:ring-blue-500/50 transition-colors"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

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
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          <span className="text-white font-medium">Sending...</span>
                        </>
                      ) : (
                        <span className="text-white font-medium flex items-center">
                          <Mail className="mr-2 h-5 w-5" />
                          Send Reset Instructions
                        </span>
                      )}
                    </div>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl opacity-20 blur-xl" />
              <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8 text-center">
                <Mail className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">Check your email</h2>
                <p className="text-gray-400 mb-6">
                  We've sent password reset instructions to {email}
                </p>
                <Link
                  href="/auth/login"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Return to login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 