import { motion } from 'framer-motion';
import { Scroll } from 'lucide-react';

export function QuestsEmpty() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] text-center p-8"
    >
      <div className="bg-white/5 p-6 rounded-full mb-6">
        <Scroll className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No Quests Available</h3>
      <p className="text-gray-400 max-w-md">
        There are no active quests at the moment. Check back later for new opportunities to earn rewards!
      </p>
    </motion.div>
  );
} 