export function NavbarLoading() {
  return (
    <div className="hidden md:flex items-center space-x-4">
      {/* Balance Loading State */}
      <div className="px-4 py-2 bg-white/5 rounded-full flex items-center space-x-2">
        <div className="h-4 w-4 bg-yellow-400/20 rounded animate-pulse" />
        <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
      </div>

      {/* Notifications Loading State */}
      <div className="relative">
        <div className="p-2">
          <div className="h-5 w-5 bg-white/10 rounded animate-pulse" />
        </div>
      </div>

      {/* User Menu Loading State */}
      <div className="flex items-center space-x-2 p-1">
        <div className="h-8 w-8 bg-white/10 rounded-full animate-pulse" />
        <div className="h-4 w-4 bg-white/10 rounded animate-pulse" />
      </div>
    </div>
  );
} 