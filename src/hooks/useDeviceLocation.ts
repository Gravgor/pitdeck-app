import { useState, useEffect } from 'react';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  isWatching: boolean;
}

export function useDeviceLocation(minimumDistance: number = 10) {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    error: null,
    isWatching: false,
  });

  useEffect(() => {
    let watchId: number;

    const startWatching = async () => {
      if (!navigator.geolocation) {
        setLocation(prev => ({
          ...prev,
          error: "Geolocation is not supported by your browser"
        }));
        return;
      }

      try {
        // First get initial position
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
        });

        setLocation(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          isWatching: true
        }));

        // Then start watching position
        let lastPosition = position.coords;

        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const newLat = position.coords.latitude;
            const newLng = position.coords.longitude;

            // Calculate distance moved
            const distance = calculateDistance(
              lastPosition.latitude,
              lastPosition.longitude,
              newLat,
              newLng
            );

            // Only update if moved more than minimum distance
            if (distance >= minimumDistance) {
              lastPosition = position.coords;
              setLocation(prev => ({
                ...prev,
                latitude: newLat,
                longitude: newLng
              }));
            }
          },
          (error) => {
            setLocation(prev => ({
              ...prev,
              error: error.message
            }));
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      } catch (error) {
        setLocation(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : "Failed to get location"
        }));
      }
    };

    startWatching();

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [minimumDistance]);

  return location;
}

// Haversine formula to calculate distance between coordinates in meters
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
} 