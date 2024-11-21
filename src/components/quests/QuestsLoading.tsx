import { motion } from 'framer-motion';

export function QuestsLoading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-white/5 rounded-lg animate-pulse" />
        <div className="h-6 w-24 bg-white/5 rounded-lg animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="bg-black/50 rounded-xl p-6 space-y-4"
          >
            {/* Quest Card Skeleton */}
            <div className="space-y-4">
              <div className="h-6 w-3/4 bg-white/5 rounded-lg animate-pulse" />
              <div className="h-4 w-full bg-white/5 rounded-lg animate-pulse" />
              <div className="h-4 w-2/3 bg-white/5 rounded-lg animate-pulse" />
            </div>

            {/* Requirements Skeleton */}
            <div className="grid grid-cols-3 gap-3">
              {[...Array(3)].map((_, j) => (
                <div
                  key={j}
                  className="aspect-[3/4] bg-white/5 rounded-lg animate-pulse"
                />
              ))}
            </div>

            {/* Reward Skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-24 bg-white/5 rounded-lg animate-pulse" />
              <div className="aspect-[3/4] w-1/3 bg-white/5 rounded-lg animate-pulse" />
            </div>

            {/* Button Skeleton */}
            <div className="h-12 w-full bg-white/5 rounded-lg animate-pulse" />
          </motion.div>
        ))}
      </div>
    </div>
  );
} 