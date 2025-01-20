'use client';

import { useState, useEffect } from 'react';
import { CreditCard } from 'lucide-react';
import { formatNumber } from '@/lib/utils/formatNumber';

export function UserBalance({ initialBalance = 0 }) {
  const [balance, setBalance] = useState(initialBalance);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBalance();

    const eventSource = new EventSource('/api/user/balance/stream');

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setBalance(data.coins);
      } catch (error) {
        console.error('Error parsing balance update:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      setError('Connection lost. Retrying...');
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await fetch('/api/user/balance');
      if (!response.ok) throw new Error('Failed to fetch balance');
      const data = await response.json();
      setBalance(data.coins);
      setError(null);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setError('Failed to load balance');
    }
  };

  return (
    <div className="px-4 py-2 bg-white/5 rounded-full flex items-center space-x-2">
      <CreditCard className="h-4 w-4 text-yellow-400" />
      <span className="text-sm text-white font-display">
        {error ? '---' : formatNumber(balance)} Race Coins
      </span>
    </div>
  );
} 