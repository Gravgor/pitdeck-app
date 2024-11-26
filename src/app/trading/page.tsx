 'use client';

import { TradeList } from '@/components/trades/TradeList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TradesPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Trading Hub</h1>
        <Button onClick={() => router.push('/trading/new')} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Trade
        </Button>
      </div>
      <TradeList />
    </div>
  );
}