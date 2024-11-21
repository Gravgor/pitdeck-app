export function FeaturedCardsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {[...Array(3)].map((_, i) => (
        <div 
          key={i}
          className="relative aspect-[2/3] bg-white/5 rounded-xl overflow-hidden border border-white/10"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          
          {/* Card content skeleton */}
          <div className="absolute inset-0 flex flex-col justify-end p-4">
            <div className="space-y-2">
              {/* Rarity badge skeleton */}
              <div className="w-20 h-6 bg-white/10 rounded-full" />
              
              {/* Name skeleton */}
              <div className="w-3/4 h-6 bg-white/10 rounded-lg" />
              
              {/* Description skeleton */}
              <div className="w-full h-4 bg-white/10 rounded-lg" />
              <div className="w-2/3 h-4 bg-white/10 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 