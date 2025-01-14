'use client';

import { Trade } from '@/types/trade';
import { TradeCard } from './TradeCard';
import TradeListSkeleton from '@/app/trading/loading';
import { EmptyTrades } from './EmptyTrades';
import { useEffect, useState } from 'react';

export function TradeList() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  useEffect(() => {
    fetchTrades();

    const interval = setInterval(fetchTrades, 15000);

    return () => clearInterval(interval);
  }, []);

  const fetchTrades = async () => {
    try {
      const response = await fetch('/api/trades', {
        cache: 'no-store',
        headers: {
          'Last-Update': lastUpdate.toString()
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch trades');
      
      const data = await response.json();
      
      const hasChanges = JSON.stringify(data.trades) !== JSON.stringify(trades);
      if (hasChanges) {
        setTrades(data.trades);
        setLastUpdate(data.timestamp);
      }
    } catch (error) {
      console.error('Error fetching trades:', error);
      setError('Failed to load trades. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <TradeListSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error}</p>
        <button
          onClick={fetchTrades}
          className="mt-4 text-sm text-blue-400 hover:text-blue-300"
        >
          Try again
        </button>
      </div>
    );
  }

  if (trades.length === 0) {
    return <EmptyTrades />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trades.map((trade) => (
        <TradeCard key={trade.id} trade={trade} onUpdate={fetchTrades} />
      ))}
    </div>
  );
} 