import { Filter, Search, Sparkles, Trophy, Clock, Wallet } from 'lucide-react';

export default function CollectionLoading() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Section */}
      <div className="relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="h-10 w-64 bg-white/5 rounded-lg animate-pulse" />
            <div className="h-6 w-48 bg-white/5 rounded-lg animate-pulse" />
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
            {[
              { icon: Trophy, color: 'blue' },
              { icon: Sparkles, color: 'purple' },
              { icon: Wallet, color: 'green' },
              { icon: Clock, color: 'yellow' },
            ].map((stat, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-${stat.color}-500/10 rounded-lg`}>
                    <stat.icon className={`h-5 w-5 text-${stat.color}-500`} />
                  </div>
                  <div>
                    <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
                    <div className="h-6 w-10 bg-white/10 rounded mt-1 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <div className="w-full h-12 bg-white/5 border border-white/10 rounded-xl animate-pulse" />
          </div>
          <div className="h-12 w-32 bg-blue-600/50 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Filters Sidebar Skeleton */}
        <aside className="space-y-8 bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
          {[...Array(4)].map((_, sectionIndex) => (
            <div key={sectionIndex}>
              <div className="h-6 w-24 bg-white/10 rounded mb-4 animate-pulse" />
              {[...Array(5)].map((_, itemIndex) => (
                <div key={itemIndex} className="flex items-center justify-between mb-2">
                  <div className="h-5 w-32 bg-white/10 rounded animate-pulse" />
                  <div className="h-5 w-8 bg-white/10 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ))}
        </aside>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(15)].map((_, index) => (
            <div 
              key={index}
              className="aspect-[2/3] bg-white/5 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
} 