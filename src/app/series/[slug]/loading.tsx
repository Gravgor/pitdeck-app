export default function SeriesLoading() {
    return (
      <div className="min-h-screen bg-black">
        {/* Hero Section Loading */}
        <div className="relative h-[40vh] min-h-[400px]">
          <div className="absolute inset-0 bg-white/5 animate-pulse" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-3xl">
                <div className="h-12 w-2/3 bg-white/5 rounded-lg animate-pulse mb-4" />
                <div className="h-6 w-full bg-white/5 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>
  
        {/* Stats Section Loading */}
        <div className="border-y border-white/10 bg-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center">
                  <div className="h-6 w-6 bg-white/5 rounded-full animate-pulse mx-auto mb-2" />
                  <div className="h-8 w-16 bg-white/5 rounded-lg animate-pulse mx-auto mb-1" />
                  <div className="h-4 w-24 bg-white/5 rounded-lg animate-pulse mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
  
        {/* Featured Cards Loading */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-8 w-48 bg-white/5 rounded-lg animate-pulse mb-8" />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i} 
                  className="aspect-[3/4] bg-white/5 rounded-xl animate-pulse"
                />
              ))}
            </div>
          </div>
        </section>
  
        {/* Categories Loading */}
        <section className="py-16 bg-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-8 w-48 bg-white/5 rounded-lg animate-pulse mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i} 
                  className="aspect-[4/3] bg-white/5 rounded-xl animate-pulse"
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }