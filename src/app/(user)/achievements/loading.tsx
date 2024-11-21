export default function AchievementsLoading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-10 w-48 bg-white/5 rounded-lg animate-pulse" />
          <div className="h-6 w-96 bg-white/5 rounded-lg mt-2 animate-pulse" />
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 w-32">
          <div className="h-8 w-16 bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-24 bg-white/10 rounded mt-2 animate-pulse" />
        </div>
      </div>

      {/* Achievement Categories Skeleton */}
      {[...Array(4)].map((_, categoryIndex) => (
        <div key={categoryIndex} className="space-y-4">
          <div className="h-8 w-48 bg-white/5 rounded-lg animate-pulse" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, achievementIndex) => (
              <div
                key={achievementIndex}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-lg animate-pulse" />
                  <div className="flex-1">
                    <div className="h-6 w-32 bg-white/10 rounded animate-pulse" />
                    <div className="h-4 w-48 bg-white/10 rounded mt-2 animate-pulse" />
                  </div>
                </div>
                <div className="mt-4 h-2 bg-white/10 rounded-full animate-pulse" />
                <div className="mt-4 h-4 w-16 bg-white/10 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 