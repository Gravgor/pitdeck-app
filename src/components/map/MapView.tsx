// @ts-nocheck
'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useGeolocation } from '@/hooks/useGeolocation';
import { Drop } from '@prisma/client';
import { MapControls } from './MapControls';
import { DropDetails } from './DropDetails';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


const FREE_RADIUS = 100; 
const PREMIUM_RADIUS = 400; 
const LOCKED_ZOOM = 17;

// Replace with your Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoibWJvcm93Y3phazIxMTUiLCJhIjoiY20zMnk1bXA5MWF2NTJxcXNhems4b2g1OCJ9.Jw4aE3ygRcqg9wXddMVVAQ';

interface MapViewProps {
  drops: Drop[];
  isPremium?: boolean;

}

export function MapView({ drops, isPremium = false }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const { location } = useGeolocation();
  const [selectedDrop, setSelectedDrop] = useState<Drop | null>(null);

  const { data: nearbyDrops, isLoading } = useQuery({
    queryKey: ['nearby-drops', location?.latitude, location?.longitude],
    queryFn: async () => {
      if (!location) return [];
      const { data } = await axios.get('/api/drops/nearby', {
        params: {
          lat: location.latitude,
          lng: location.longitude,
          radius: isPremium ? PREMIUM_RADIUS : FREE_RADIUS
        }
      });
      return data;
    },
    enabled: !!location,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [0, 0],
      zoom: LOCKED_ZOOM,
      dragPan: true,
      keyboard: false,
      scrollZoom: false,
    });

    // Wait for map style to load before adding markers
    map.current.on('style.load', () => {
      // Add custom user marker element
      const userMarkerElement = document.createElement('div');
      userMarkerElement.className = 'user-marker';
      userMarkerElement.innerHTML = `
        <div class="relative">
          <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
            <div class="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <div class="absolute -inset-1 bg-blue-500/30 rounded-full animate-ping"></div>
        </div>
      `;

      userMarkerRef.current = new mapboxgl.Marker({
        element: userMarkerElement,
        rotationAlignment: 'map',
      })
        .setLngLat([0, 0])
        .addTo(map.current);
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update user location and radius circles
  useEffect(() => {
    if (!map.current || !location || !userMarkerRef.current || !map.current.isStyleLoaded()) return;

    const { longitude, latitude } = location;

    // Update user marker position
    userMarkerRef.current.setLngLat([longitude, latitude]);

    // Center map on user
    map.current.setCenter([longitude, latitude]);

    // Add/update radius circles
    const radiusSource = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          // Free radius
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            properties: {
              radius: FREE_RADIUS,
              color: '#4ADE80',
            },
          },
          // Premium radius
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            properties: {
              radius: PREMIUM_RADIUS,
              color: '#F472B6',
            },
          },
        ],
      },
    };

    // Update or add radius circles
    if (map.current.getSource('radius')) {
      (map.current.getSource('radius') as mapboxgl.GeoJSONSource).setData(radiusSource.data);
    } else {
      map.current.addSource('radius', radiusSource);
      map.current.addLayer({
        id: 'radius-circles',
        type: 'circle',
        source: 'radius',
        paint: {
          'circle-radius': ['get', 'radius'],
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.15,
          'circle-stroke-width': 2,
          'circle-stroke-color': ['get', 'color'],
          'circle-stroke-opacity': 0.3,
        },
      });
    }

    // Lock camera to user location
    map.current.on('movestart', (e) => {
      if (!e.originalEvent) return;
      requestAnimationFrame(() => {
        map.current?.setCenter([longitude, latitude]);
      });
    });

  }, [location]);

  // Update the drops rendering effect
  useEffect(() => {
    if (!map.current || !location || !nearbyDrops) return;

    // Clear existing markers
    const markers = document.getElementsByClassName('drop-marker');
    while (markers[0]) {
      markers[0].remove();
    }

    nearbyDrops.forEach((drop: Drop) => {
      const el = document.createElement('div');
      el.className = 'drop-marker';
      el.innerHTML = `
        <div class="w-8 h-8 ${getRarityColor(drop.rarity)} rounded-full 
                    flex items-center justify-center cursor-pointer 
                    transform transition-transform hover:scale-110
                    ${isLoading ? 'opacity-50' : ''}">
          ${getDropIcon(drop.type)}
        </div>
      `;

      el.addEventListener('click', () => setSelectedDrop(drop));

      new mapboxgl.Marker(el)
        .setLngLat([drop.longitude, drop.latitude])
        .addTo(map.current!);
    });
  }, [nearbyDrops, location, isLoading]);

  return (
    <div className="h-[calc(100vh-64px)] relative">
      <div ref={mapContainer} className="h-full w-full" />

      {selectedDrop && (
        <div className="absolute bottom-0 left-0 right-0 md:left-4 md:bottom-4 md:w-96">
          <DropDetails
            drop={selectedDrop}
            onClose={() => setSelectedDrop(null)}
          />
        </div>
      )}

    </div>
  );
}

function getDropIcon(type: string) {
  switch (type) {
    case 'PACK':
      return '📦';
    case 'CARD':
      return '🃏';
    case 'COINS':
      return '💰';
    case 'SPECIAL':
      return '⭐';
    default:
      return '📍';
  }
} 

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

// Add this function to get rarity colors
function getRarityColor(rarity: string) {
  switch (rarity) {
    case 'LEGENDARY':
      return 'bg-yellow-500';
    case 'RARE':
      return 'bg-purple-500';
    case 'UNCOMMON':
      return 'bg-blue-500';
    case 'COMMON':
    default:
      return 'bg-gray-500';
  }
}