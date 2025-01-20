'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react';
import { signInSchema, type SignInInput } from '@/lib/validations/auth';
import Link from 'next/link';
import Image from 'next/image';

export function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Partial<SignInInput>>({});

  const validateField = (name: keyof SignInInput, value: string) => {
    try {
      //@ts-ignore
      signInSchema.pick({ [name]: true }).parse({ [name]: value });
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
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    try {
      signInSchema.parse(data);
      setIsLoading(true);

      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
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
    <div className="w-full max-w-md relative">
      {/* Form Container */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-2xl opacity-20 blur-xl" />
        <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
                Welcome Back
              </span>
            </h1>
            <p className="mt-2 text-gray-400">
              Sign in to continue to PitDeck
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Email address
                </label>
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-xl opacity-0 group-focus-within:opacity-20 transition-opacity blur-xl" />
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      onChange={(e) => validateField('email', e.target.value)}
                      className="block w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 
                               rounded-lg text-white placeholder:text-gray-500
                               focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50
                               transition-colors"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>
                {validationErrors.email && (
                  <p className="mt-1.5 text-sm text-red-400">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Password
                </label>
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-xl opacity-0 group-focus-within:opacity-20 transition-opacity blur-xl" />
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      type="password"
                      name="password"
                      id="password"
                      required
                      onChange={(e) => validateField('password', e.target.value)}
                      className="block w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 
                               rounded-lg text-white placeholder:text-gray-500
                               focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50
                               transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                {validationErrors.password && (
                  <p className="mt-1.5 text-sm text-red-400">{validationErrors.password}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-white/10 bg-white/5 text-blue-500 
                           focus:ring-1 focus:ring-blue-500 focus:ring-offset-0"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-400">
                  Remember me
                </label>
              </div>

              <Link 
                href="/auth/forgot-password" 
                className="text-sm font-medium text-blue-400 hover:text-blue-300 
                         transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg opacity-50 blur-sm 
                              group-hover:opacity-75 transition-opacity" />
                <div className="relative flex items-center justify-center px-4 py-3 bg-black rounded-lg">
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                      <span className="text-white font-medium">Signing in...</span>
                    </>
                  ) : (
                    <span className="text-white font-medium">Sign in</span>
                  )}
                </div>
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black text-gray-500">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => signIn('google', { callbackUrl: '/collection' })}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 
                         bg-white/5 hover:bg-white/10 border border-white/10 
                         rounded-lg text-sm font-medium text-white 
                         transition-colors"
              >
                <Image src="/google.svg" alt="Google" width={20} height={20} className="h-5 w-5" />
                Google
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link 
              href="/auth/register" 
              className="font-medium text-blue-400 hover:text-blue-300 
                       transition-colors"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}