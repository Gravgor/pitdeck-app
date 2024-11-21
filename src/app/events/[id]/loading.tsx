export default function EventLoading() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section Skeleton */}
      <div className="relative h-[50vh] min-h-[400px] bg-white/5 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
            <div className="h-4 w-24 bg-white/20 rounded animate-pulse mb-4" />
            <div className="h-10 w-96 bg-white/20 rounded animate-pulse mb-4" />
            <div className="flex flex-wrap gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-6 w-32 bg-white/20 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Event Details Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Schedule Skeleton */}
            <section>
              <div className="h-8 w-48 bg-white/10 rounded animate-pulse mb-6" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5"
                  >
                    <div className="h-4 w-32 bg-white/20 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-white/20 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </section>

            {/* Exclusive Cards Skeleton */}
            <section>
              <div className="h-8 w-64 bg-white/10 rounded animate-pulse mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] rounded-xl bg-white/5 animate-pulse"
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-8">
            {/* Event Stats Skeleton */}
            <div className="rounded-xl bg-white/5 p-6 space-y-6">
              <div className="h-6 w-32 bg-white/20 rounded animate-pulse" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="h-5 w-32 bg-white/20 rounded animate-pulse" />
                    <div className="h-5 w-16 bg-white/20 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            {/* Map Skeleton */}
            <div className="rounded-xl overflow-hidden h-64 bg-white/5 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
} 