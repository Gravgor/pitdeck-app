export default function TradeListSkeleton() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-[#12141A] rounded-lg p-4 animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="h-5 w-32 bg-white/10 rounded mb-2" />
                <div className="h-4 w-24 bg-white/10 rounded" />
              </div>
              <div className="h-6 w-20 bg-white/10 rounded" />
            </div>
  
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[...Array(4)].map((_, j) => (
                <div
                  key={j}
                  className="aspect-square rounded-md bg-white/10"
                />
              ))}
            </div>
  
            <div className="h-4 w-3/4 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    );
  }