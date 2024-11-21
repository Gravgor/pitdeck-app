export default function CollectionsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Skeleton */}
      <div>
        <div className="h-10 w-64 bg-white/5 rounded-lg animate-pulse" />
        <div className="h-6 w-96 bg-white/5 rounded-lg mt-2 animate-pulse" />
      </div>

      {/* Collections Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, index) => (
          <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/10 animate-pulse" />
              <div>
                <div className="h-6 w-32 bg-white/10 rounded animate-pulse" />
                <div className="h-4 w-24 bg-white/10 rounded mt-2 animate-pulse" />
              </div>
            </div>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="text-center">
                  <div className="w-10 h-10 rounded-lg bg-white/10 mx-auto mb-2 animate-pulse" />
                  <div className="h-5 w-12 bg-white/10 rounded mx-auto animate-pulse" />
                  <div className="h-3 w-16 bg-white/10 rounded mx-auto mt-1 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 