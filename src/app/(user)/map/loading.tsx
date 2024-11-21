export default function MapLoading() {
  return (
    <div className="min-h-screen bg-[#0A0C10] flex items-center justify-center">
      <div className="text-center">
        <div className="h-32 w-32 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/70">Loading map...</p>
      </div>
    </div>
  );
} 