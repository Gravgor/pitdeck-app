import { useState, useEffect } from 'react';
import { Drop, Circuit, Event } from '@prisma/client';

interface UseNearbyDropsResult {
  drops: Drop[];
  isLoading: boolean;
  error: string | null;
  refetch: (latitude: number, longitude: number) => Promise<void>;
}

export function useNearbyDrops(
  initialDrops: Drop[],
  initialCircuits?: Circuit[],
  initialEvents?: Event[]
): UseNearbyDropsResult {
  const [drops, setDrops] = useState<Drop[]>(initialDrops);
  //const [circuits, setCircuits] = useState<Circuit[]>(initialCircuits);
  //const [activeEvents, setActiveEvents] = useState<Event[]>(initialEvents);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDrops = async (latitude: number, longitude: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/drops?` +
        new URLSearchParams({
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          radius: "10",
        })
      );

      if (!response.ok) {
        throw new Error('Failed to fetch drops');
      }

      const data = await response.json();
      
      setDrops(data.drops);
      //setCircuits(data.circuits);
      //setActiveEvents(data.activeEvents);
    } catch (error) {
      console.error('Error fetching drops:', error);
      setError('Failed to fetch nearby drops');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    drops,
    isLoading,
    error,
    refetch: fetchDrops,
  };
} 