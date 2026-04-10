import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronDown } from 'lucide-react';
import { haptics } from '@/utils/haptics';
import { LocationSelector } from '@/components/LocationSelector';

export function LocationBar() {
  const [selectedLocation, setSelectedLocation] = useState('Palembang');
  const [locationOpen, setLocationOpen] = useState(false);

  return (
    <>
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          haptics.light();
          setLocationOpen(true);
        }}
        className="w-full bg-card rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm border border-border/50"
      >
        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
          <MapPin className="h-4 w-4 text-accent" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-xs text-muted-foreground">Deliver to</p>
          <p className="text-sm font-medium text-foreground">{selectedLocation}</p>
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </motion.button>

      <LocationSelector
        open={locationOpen}
        onOpenChange={setLocationOpen}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
      />
    </>
  );
}
