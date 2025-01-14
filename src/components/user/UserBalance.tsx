'use client';

import { useState, useEffect } from 'react';
import { CreditCard } from 'lucide-react';
import { formatNumber } from '@/lib/utils/formatNumber';

export function UserBalance({ initialBalance = 0 }) {
  const [balance, setBalance] = useState(initialBalance);

  const fetchBalance = async () => {
    try {
      const response = await fetch('/api/user/balance');
      if (!response.ok) throw new Error('Failed to fetch balance');
      const data = await response.json();
      setBalance(data.coins);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchBalance();

    // Set up polling every 30 seconds
    const interval = setInterval(fetchBalance, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-4 py-2 bg-white/5 rounded-full flex items-center space-x-2">
      <CreditCard className="h-4 w-4 text-yellow-400" />
      <span className="text-sm text-white font-display">
        {formatNumber(balance)} Race Coins
      </span>
    </div>
  );
} 