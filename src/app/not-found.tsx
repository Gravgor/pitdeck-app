import Link from 'next/link';
import { Flag, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="text-center space-y-6">
          {/* 404 Header */}
          <div className="relative">
            <h1 className="text-8xl font-display font-bold text-red-500">404</h1>
            <div className="absolute -top-4 -right-4 p-3 bg-red-500/10 rounded-full">
              <Flag className="w-6 h-6 text-red-500" />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h2 className="text-2xl font-display font-bold text-white">
              Pit Stop! Page Not Found
            </h2>
            <p className="text-gray-400">
              Looks like you've ventured off track. This page doesn't exist or has been moved to a different circuit.
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 
                         text-white rounded-full transition-colors duration-200"
            >
              <Home className="w-4 h-4" />
              Back to Pit Lane
            </Link>
          </div>

          {/* Additional Help */}
          <div className="text-sm text-gray-500">
            Need assistance? <Link href="/contact" className="text-red-400 hover:text-red-300 underline decoration-dotted">Contact our pit crew</Link>
          </div>
        </div>
      </div>
    </div>
  );
} 