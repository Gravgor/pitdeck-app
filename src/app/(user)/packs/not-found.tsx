import Link from 'next/link';
import { Home, Package, ShoppingCart } from 'lucide-react';

export default function PacksNotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-4">
          {/* Icon Animation Container */}
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 bg-red-500/10 rounded-full animate-ping opacity-75" />
            <div className="relative w-32 h-32 bg-red-500/10 rounded-full flex items-center justify-center">
              <Package className="h-16 w-16 text-red-500" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            Packs Unavailable
          </h1>
          
          <p className="text-gray-400 text-lg">
            We're currently restocking our pack store. Please check back later!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white
                     bg-gradient-to-r from-red-500 to-red-600 rounded-lg 
                     hover:from-red-600 hover:to-red-700 transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 
                     focus:ring-offset-gray-900 shadow-lg shadow-red-500/20"
          >
            <Home className="h-4 w-4" />
            Return Home
          </Link>
          
          <Link
            href="/marketplace"
            className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium
                     text-white bg-gray-800 rounded-lg hover:bg-gray-700
                     transition-all duration-200 border border-red-500/10
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 
                     focus:ring-offset-gray-900"
          >
            <ShoppingCart className="h-4 w-4" />
            Visit Marketplace
          </Link>
        </div>

        <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/10">
          <p className="text-sm text-gray-400">
            Want to be notified when new packs are available?{' '}
            <Link 
              href="/notifications" 
              className="text-red-400 hover:text-red-300 underline decoration-dotted"
            >
              Enable notifications
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 