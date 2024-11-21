'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, RefreshCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to your error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            Something went wrong!
          </h1>
          <p className="text-gray-400 text-lg">
            We apologize for the inconvenience. Please try again later.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-4 bg-red-900/20 rounded-lg border border-red-500/10">
              <p className="text-red-400 text-sm font-mono">
                {error.message}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white
                     bg-gradient-to-r from-red-500 to-red-600 rounded-lg 
                     hover:from-red-600 hover:to-red-700 transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 
                     focus:ring-offset-gray-900"
          >
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium
                     text-white bg-gray-800 rounded-lg hover:bg-gray-700
                     transition-all duration-200 border border-red-500/10
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 
                     focus:ring-offset-gray-900"
          >
            <Home className="h-4 w-4" />
            Return Home
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && error.digest && (
          <p className="text-gray-500 text-sm">
            Error Digest: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
} 