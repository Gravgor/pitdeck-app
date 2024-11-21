'use client';

import { Drop } from '@prisma/client';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

interface DropMarkerProps {
  drop: Drop;
  selected?: boolean;
  onClick: () => void;
}

export function DropMarker({ drop, selected, onClick }: DropMarkerProps) {
  return (
    <Marker
      position={[drop.latitude, drop.longitude]}
      icon={createDropIcon(drop.type, selected ?? false)}
      eventHandlers={{ click: onClick }}
    >
      <Popup>
        <div className="text-sm">
          <h3 className="font-bold">{drop.type}</h3>
          <p className="mt-2 text-xs">
            Available until {new Date(drop.expiresAt).toLocaleDateString()}
          </p>
        </div>
      </Popup>
    </Marker>
  );
}

function createDropIcon(type: string, selected: boolean) {
  const color = selected ? 'red' : 'gray';
  return L.divIcon({
    html: `
      <div class="relative">
        <div class="h-6 w-6 bg-${color}-500 rounded-full flex items-center justify-center">
          ${getDropIcon(type)}
        </div>
        ${selected ? '<div class="absolute inset-0 animate-ping bg-red-500/50 rounded-full"></div>' : ''}
      </div>
    `,
    className: 'custom-drop-marker',
  });
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
