//@ts-nocheck
import { Trophy, Star, Wallet, Clock } from 'lucide-react';

export default function CollectionLoading() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Section */}
      <div className="flex items-center gap-6">
        <div className="relative w-16 h-16">
          <div className="w-full h-full rounded-full bg-white/5 animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-10 w-64 bg-white/5 rounded-lg animate-pulse" />
          <div className="h-5 w-48 bg-white/5 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Trophy, color: 'blue' },
          { icon: Star, color: 'yellow' },
          { icon: Wallet, color: 'green' },
          { icon: Clock, color: 'purple' },
        ].map((stat, index) => (
          <LoadingStatCard key={index} icon={stat.icon} color={stat.color} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-8">
        {/* Filters Sidebar */}
        <aside className="space-y-8 bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 h-fit">
          <div>
            <div className="h-7 w-32 bg-white/5 rounded-lg animate-pulse mb-4" />
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center justify-between mb-2">
                <div className="h-5 w-24 bg-white/5 rounded animate-pulse" />
                <div className="h-5 w-8 bg-white/5 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </aside>

        {/* Cards Grid Loading */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] rounded-xl bg-white/5 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function LoadingStatCard({ icon: Icon, color }: { 
  icon: any;
  color: 'blue' | 'yellow' | 'green' | 'purple';
}) {
  const colors = {
    blue: 'bg-blue-500/10',
    yellow: 'bg-yellow-500/10',
    green: 'bg-green-500/10',
    purple: 'bg-purple-500/10',
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon className="h-5 w-5 opacity-50" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-16 bg-white/5 rounded animate-pulse" />
          <div className="h-6 w-12 bg-white/5 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
} 