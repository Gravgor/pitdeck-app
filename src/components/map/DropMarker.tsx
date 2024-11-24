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
  return L.divIcon({
    html: `
      <div class="relative">
        <div class="w-10 h-14 bg-black/90 backdrop-blur-sm border ${selected ? 'border-red-500' : 'border-white/20'} rounded-lg flex items-center justify-center transform hover:scale-110 transition-all shadow-lg">
          <div class="flex flex-col items-center">
            <span class="text-xl text-white font-bold">?</span>
            <span class="text-[8px] text-gray-400 uppercase mt-0.5">${type}</span>
          </div>
        </div>
        ${selected ? '<div class="absolute inset-0 animate-ping bg-red-500/30 rounded-lg"></div>' : ''}
      </div>
    `,
    className: 'custom-drop-marker',
    iconSize: [40, 56],
    iconAnchor: [20, 56],
    popupAnchor: [0, -48]
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
