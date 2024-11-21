export default function ProfileLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl p-6 shadow-xl border border-red-500/10">
        {/* Profile Header Skeleton */}
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gray-800 animate-pulse ring-4 ring-red-500/20" />
          <div className="flex-grow">
            <div className="h-8 w-48 bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-800 rounded mt-2 animate-pulse" />
          </div>
        </div>

        {/* Stats Overview Skeleton */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-red-500/10">
              <div className="h-4 w-20 bg-gray-800 rounded animate-pulse" />
              <div className="h-8 w-16 bg-gray-800 rounded mt-2 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Collection Preview Skeleton */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 w-40 bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="bg-black/50 rounded-xl p-6 border border-red-500/10">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-gray-800 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </section>

        {/* Recent Activity Skeleton */}
        <section className="mt-12">
          <div className="h-6 w-40 bg-gray-800 rounded animate-pulse mb-6" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg animate-pulse" />
                <div className="flex-grow">
                  <div className="h-4 w-3/4 bg-gray-800 rounded animate-pulse" />
                  <div className="h-3 w-1/4 bg-gray-800 rounded mt-2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
} 