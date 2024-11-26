import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function EmptyTrades() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-white/5 rounded-full p-4 mb-4">
        <Package className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No Trades Available</h3>
      <p className="text-gray-400 text-center mb-6 max-w-md">
        There are no active trades at the moment. Be the first to create a trade and start exchanging cards with other collectors!
      </p>
      <Button
        onClick={() => router.push('/trading/new')}
        className="flex items-center gap-2"
      >
        Create Your First Trade
      </Button>
    </div>
  );
} 