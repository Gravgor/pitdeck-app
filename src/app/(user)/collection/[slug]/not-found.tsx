import Link from 'next/link';
import { Search } from 'lucide-react';

export default function CollectionNotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Icon */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" />
          <div className="relative flex items-center justify-center w-full h-full bg-red-500/10 rounded-full">
            <Search className="w-12 h-12 text-red-500" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white">
            Collection Not Found
          </h1>
          <p className="text-gray-400">
            We couldn't find the collection you're looking for. The user might not exist or has changed their username.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/explore"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full
                     bg-red-500 hover:bg-red-600 text-white transition-colors"
          >
            Explore Collections
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full
                     bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Go Home
          </Link>
        </div>

        {/* Additional Help */}
        <p className="text-sm text-gray-500">
          Need help? <Link href="/contact" className="text-red-400 hover:text-red-300 underline decoration-dotted">Contact Support</Link>
        </p>
      </div>
    </div>
  );
}