export function BlogHeader() {
  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <span className="text-sm text-white/80">PitDeck Blog</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
              Latest Updates from
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500">
              The World of Motorsport Cards
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            News, features, and insights about F1 cards, motorsport collecting, and the PitDeck platform
          </p>
        </div>
      </div>
    </div>
  );
} 