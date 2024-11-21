export default function PacksLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-10 w-48 bg-white/5 rounded-lg animate-pulse mb-8" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div 
            key={index}
            className="bg-gradient-to-b from-gray-900 to-black rounded-2xl p-6 border border-red-500/10"
          >
            {/* Pack Image Skeleton */}
            <div className="aspect-[16/9] bg-white/5 rounded-xl animate-pulse mb-6" />
            
            {/* Pack Info */}
            <div className="space-y-4">
              <div className="h-7 w-3/4 bg-white/5 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-white/5 rounded animate-pulse" />
              
              {/* Pack Stats */}
              <div className="grid grid-cols-3 gap-4 my-6">
                {[...Array(3)].map((_, statIndex) => (
                  <div key={statIndex} className="space-y-2">
                    <div className="h-4 w-16 bg-white/5 rounded animate-pulse" />
                    <div className="h-6 w-10 bg-white/5 rounded animate-pulse" />
                  </div>
                ))}
              </div>
              
              {/* Price and Button */}
              <div className="flex items-center justify-between mt-6">
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-white/5 rounded animate-pulse" />
                  <div className="h-7 w-24 bg-white/5 rounded animate-pulse" />
                </div>
                <div className="h-12 w-32 bg-red-500/20 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 