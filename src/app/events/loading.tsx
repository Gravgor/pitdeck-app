import { Calendar, MapPin, Gift, Flag } from 'lucide-react';

export default function EventsLoading() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header Skeleton */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/50 via-blue-600/30 to-slate-900/50" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-8 w-48 bg-white/10 rounded-lg animate-pulse mb-4" />
          <div className="h-6 w-96 bg-white/10 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="h-10 w-full sm:w-64 bg-white/10 rounded-lg animate-pulse" />
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 w-20 bg-white/10 rounded-full animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="relative rounded-xl overflow-hidden">
              <div className="aspect-[4/3] bg-white/10 animate-pulse" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-white/20 rounded animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-6 w-48 bg-white/20 rounded animate-pulse" />
                    <div className="h-4 w-40 bg-white/20 rounded animate-pulse" />
                    <div className="h-4 w-36 bg-white/20 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 