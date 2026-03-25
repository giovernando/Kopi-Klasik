import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';

interface DeliveryMapProps {
  deliveryMethod: 'grab' | 'gojek';
}

export function DeliveryMap({ deliveryMethod }: DeliveryMapProps) {
  const [driverPosition, setDriverPosition] = useState({ x: 20, y: 80 });
  const destinationPosition = { x: 75, y: 25 };

  // Simulate driver movement
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverPosition((prev) => {
        const dx = (destinationPosition.x - prev.x) * 0.05;
        const dy = (destinationPosition.y - prev.y) * 0.05;
        return {
          x: prev.x + dx + (Math.random() - 0.5) * 2,
          y: prev.y + dy + (Math.random() - 0.5) * 2,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-48 bg-secondary rounded-xl overflow-hidden">
      {/* Map background with grid */}
      <div className="absolute inset-0 opacity-30">
        <svg width="100%" height="100%" className="text-muted-foreground">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Roads */}
      <svg className="absolute inset-0 w-full h-full">
        <path
          d="M 10,90 Q 30,50 50,40 T 90,20"
          fill="none"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.3"
        />
        <path
          d="M 10,90 Q 30,50 50,40 T 90,20"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="3"
          strokeDasharray="8,4"
          strokeLinecap="round"
        />
      </svg>

      {/* Destination marker */}
      <motion.div
        className="absolute"
        style={{
          left: `${destinationPosition.x}%`,
          top: `${destinationPosition.y}%`,
          transform: 'translate(-50%, -100%)',
        }}
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="relative">
          <MapPin className="h-8 w-8 text-accent fill-accent" />
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-accent rounded-full animate-ping" />
        </div>
      </motion.div>

      {/* Driver marker */}
      <motion.div
        className="absolute"
        style={{
          left: `${driverPosition.x}%`,
          top: `${driverPosition.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
          deliveryMethod === 'grab' ? 'bg-emerald-500' : 'bg-red-500'
        }`}>
          <Navigation className="h-5 w-5 text-white" />
        </div>
      </motion.div>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${
            deliveryMethod === 'grab' ? 'bg-emerald-500' : 'bg-red-500'
          }`} />
          <span className="font-medium capitalize">{deliveryMethod} Driver</span>
        </div>
      </div>

      {/* ETA */}
      <div className="absolute top-2 right-2 bg-accent text-accent-foreground rounded-lg px-3 py-1 text-sm font-semibold">
        ~8 min
      </div>
    </div>
  );
}
