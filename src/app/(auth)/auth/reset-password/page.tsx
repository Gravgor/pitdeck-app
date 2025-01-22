'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.pitdeck.app/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      toast.success('Password reset successfully');
      router.push('/auth/login');
    } catch (error) {
      toast.error('Failed to reset password. Please try again.');
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
              Enter your new password below.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-2xl opacity-20 blur-xl" />
            <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password */}
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-xl opacity-0 group-focus-within:opacity-20 transition-opacity blur-xl" />
                  <div className="relative">
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="newPassword"
                        required
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white 
                                 placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-1 
                                 focus:ring-blue-500/50 transition-colors pr-10"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-xl opacity-0 group-focus-within:opacity-20 transition-opacity blur-xl" />
                  <div className="relative">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1.5">
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white 
                               placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-1 
                               focus:ring-blue-500/50 transition-colors"
                      placeholder="Confirm new password"
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
                        <span className="text-white font-medium">Resetting...</span>
                      </>
                    ) : (
                      <span className="text-white font-medium flex items-center">
                        <Lock className="mr-2 h-5 w-5" />
                        Reset Password
                      </span>
                    )}
                  </div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 