export default function ResetPasswordLoading() {
  return (
    <div className="min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 via-blue-600/30 to-transparent animate-gradient" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
      </div>

      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="h-8 w-24 bg-white/5 rounded-full animate-pulse mx-auto mb-8" />
            <div className="h-8 w-48 bg-white/5 rounded-lg animate-pulse mx-auto mb-2" />
            <div className="h-4 w-32 bg-white/5 rounded animate-pulse mx-auto" />
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-2xl opacity-20 blur-xl" />
            <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
                  <div className="h-12 w-full bg-white/5 rounded-lg animate-pulse" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
                  <div className="h-12 w-full bg-white/5 rounded-lg animate-pulse" />
                </div>
                <div className="h-12 w-full bg-white/5 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 