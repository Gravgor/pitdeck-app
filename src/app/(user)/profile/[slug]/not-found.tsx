import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function ProfileNotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            Profile Not Found
          </h1>
          <p className="text-gray-400 text-lg">
            The profile you're looking for doesn't exist or has been removed.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white
                     bg-gradient-to-r from-red-500 to-red-600 rounded-lg 
                     hover:from-red-600 hover:to-red-700 transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 
                     focus:ring-offset-gray-900"
          >
            <Home className="h-4 w-4" />
            Return Home
          </Link>
          <Link
            href="/search"
            className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium
                     text-white bg-gray-800 rounded-lg hover:bg-gray-700
                     transition-all duration-200 border border-red-500/10
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 
                     focus:ring-offset-gray-900"
          >
            <Search className="h-4 w-4" />
            Search Profiles
          </Link>
        </div>
      </div>
    </div>
  );
} 