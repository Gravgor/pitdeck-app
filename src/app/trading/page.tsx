'use client';

import { TradeList } from '@/components/trades/TradeList';
import { Button } from '@/components/ui/button';
import { Plus, Clock, InboxIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TradesPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Trading Hub</h1>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            onClick={() => router.push('/trading/received-offers')}
            className="flex items-center gap-2"
          >
            <InboxIcon className="w-4 h-4" />
            Received Offers
          </Button>
          <Button 
            variant="outline"
            onClick={() => router.push('/trading/sent-offers')}
            className="flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Sent Offers
          </Button>
          <Button 
            onClick={() => router.push('/trading/new')} 
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Trade
          </Button>
        </div>
      </div>
      <TradeList />
    </div>
  );
}