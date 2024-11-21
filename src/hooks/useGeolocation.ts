import { useState, useEffect } from 'react';
import axios from 'axios';

interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export function useGeolocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    const updateLocation = async (position: GeolocationPosition) => {
      const newLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };

      setLocation(newLocation);

      try {
        await axios.post('/api/users/location/update', {
          latitude: newLocation.latitude,
          longitude: newLocation.longitude,
        });
      } catch (error) {
        console.error('Failed to update location:', error);
      }
    };

    const watchId = navigator.geolocation.watchPosition(
      updateLocation,
      (error) => {
        setError(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { location, error };
} 