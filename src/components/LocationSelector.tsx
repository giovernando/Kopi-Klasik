import { useState } from 'react';
import { MapPin, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const cities = [
  { id: 'palembang', name: 'Palembang', address: 'Jl. Sudirman No. 123' },
  { id: 'jakarta', name: 'Jakarta', address: 'Jl. Thamrin No. 456' },
  { id: 'bandung', name: 'Bandung', address: 'Jl. Braga No. 789' },
  { id: 'surabaya', name: 'Surabaya', address: 'Jl. Pemuda No. 321' },
  { id: 'yogyakarta', name: 'Yogyakarta', address: 'Jl. Malioboro No. 654' },
];

interface LocationSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLocation: string;
  onSelectLocation: (location: string) => void;
}

export function LocationSelector({
  open,
  onOpenChange,
  selectedLocation,
  onSelectLocation,
}: LocationSelectorProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-display">Select Location</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 mt-4">
          {cities.map((city) => (
            <button
              key={city.id}
              onClick={() => {
                onSelectLocation(city.name);
                onOpenChange(false);
              }}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-xl border border-border transition-all',
                selectedLocation === city.name
                  ? 'bg-primary/10 border-primary'
                  : 'bg-card hover:bg-secondary'
              )}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  selectedLocation === city.name ? 'bg-primary' : 'bg-secondary'
                )}
              >
                <MapPin
                  className={cn(
                    'h-5 w-5',
                    selectedLocation === city.name ? 'text-primary-foreground' : 'text-muted-foreground'
                  )}
                />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-foreground">{city.name}</p>
                <p className="text-xs text-muted-foreground">{city.address}</p>
              </div>
              {selectedLocation === city.name && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
