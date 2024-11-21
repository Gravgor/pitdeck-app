'use client';

import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { MapPin, Filter } from 'lucide-react';

interface MapControlsProps {
  onRadiusChange: (radius: number) => void;
  onLocationRequest: () => void;
}

export function MapControls({ onRadiusChange, onLocationRequest }: MapControlsProps) {
  return (
    <div className="absolute top-4 right-4 z-[1000] space-y-4">
      <div className="bg-black/90 backdrop-blur-sm p-4 rounded-xl border border-white/10">
        <div className="mb-4">
          <label className="text-sm text-white/70 block mb-2">Search Radius</label>
          <Slider
            defaultValue={[5]}
            max={50}
            step={1}
            onValueChange={([value]) => onRadiusChange(value)}
          />
        </div>
        
        <Button
          onClick={onLocationRequest}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <MapPin className="h-4 w-4 mr-2" />
          Find Nearby
        </Button>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="bg-black/90 backdrop-blur-sm"
      >
        <Filter className="h-4 w-4" />
      </Button>
    </div>
  );
} 