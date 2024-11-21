'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Eye, EyeOff, Link, Loader2, Mail, User, Lock } from 'lucide-react';
import { registerSchema } from '@/lib/validations/auth';
import { RegisterInput } from '@/lib/validations/auth';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';


export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Partial<RegisterInput>>({});

  const validateField = (name: keyof RegisterInput, value: string) => {
    try {
      //@ts-ignore
      registerSchema.pick({ [name]: true }).parse({ [name]: value });
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    } catch (error) {
      if (error instanceof Error) {
        setValidationErrors((prev) => ({ ...prev, [name]: error.message }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    try {
      // Validate all fields
      registerSchema.parse(data);

      setIsLoading(true);

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const responseData = await res.json();
        throw new Error(responseData.error || 'Something went wrong');
      }

      // Sign in the user after successful registration
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Error signing in after registration');
        return;
      }

      router.push('/collection');
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Something went wrong');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 ">
      <div className="w-full max-w-[400px] relative">
        {/* Animated background gradients */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-red-500/10 to-red-500/5 blur-3xl" />
        </motion.div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-black/80 backdrop-blur-sm rounded-2xl border border-white/5 p-6 shadow-xl"
        >
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-2xl font-bold text-red-500">
              Join PitDeck
            </h1>
            <p className="text-gray-400 text-sm">
              Start your racing collection journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  onChange={(e) => validateField('name', e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 
                           rounded-lg text-white placeholder:text-gray-600
                           focus:border-red-500 focus:ring-1 focus:ring-red-500
                           transition-colors duration-200"
                  placeholder="Your cool username"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  onChange={(e) => validateField('email', e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 
                           rounded-lg text-white placeholder:text-gray-600
                           focus:border-red-500 focus:ring-1 focus:ring-red-500
                           transition-colors duration-200"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  required
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validateField('password', e.target.value);
                  }}
                  className="block w-full pl-10 pr-12 py-2.5 bg-white/5 border border-white/10 
                           rounded-lg text-white placeholder:text-gray-600
                           focus:border-red-500 focus:ring-1 focus:ring-red-500
                           transition-colors duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 
                           hover:text-gray-400 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <PasswordStrengthIndicator password={password} />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center px-4 py-2.5
                       bg-red-500 hover:bg-red-600 rounded-lg 
                       text-sm font-medium text-white
                       disabled:opacity-50 disabled:cursor-not-allowed 
                       transition-colors duration-200 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-black text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl: '/browse' })}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5
                       bg-white/5 hover:bg-white/10 border border-white/10 
                       rounded-lg text-sm font-medium text-white 
                       transition-colors duration-200"
            >
              <Image src="/google.svg" alt="Google" className="h-5 w-5" />
              Continue with Google
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link 
              href="/auth/signin" 
              className="text-red-500 hover:text-red-400 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}