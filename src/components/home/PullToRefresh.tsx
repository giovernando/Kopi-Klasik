import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useState, useCallback, ReactNode } from 'react';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
}

export function PullToRefresh({ children, onRefresh }: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const y = useMotionValue(0);
  const threshold = 80;

  const rotate = useTransform(y, [0, threshold], [0, 360]);
  const opacity = useTransform(y, [0, threshold / 2, threshold], [0, 0.5, 1]);
  const scale = useTransform(y, [0, threshold], [0.5, 1]);

  const handleDrag = useCallback((_: any, info: PanInfo) => {
    if (window.scrollY > 0) {
      y.set(0);
      return;
    }
    const newY = Math.max(0, Math.min(info.offset.y, threshold * 1.5));
    y.set(newY);
  }, [y, threshold]);

  const handleDragEnd = useCallback(async () => {
    const currentY = y.get();
    
    if (currentY >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      y.set(threshold);
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        y.set(0);
      }
    } else {
      y.set(0);
    }
  }, [y, threshold, isRefreshing, onRefresh]);

  return (
    <div className="relative overflow-hidden">
      {/* Pull indicator */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 z-50 flex items-center justify-center"
        style={{ 
          top: useTransform(y, (value) => value - 50),
          opacity,
          scale,
        }}
      >
        <motion.div 
          className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg"
          style={{ rotate: isRefreshing ? undefined : rotate }}
          animate={isRefreshing ? { rotate: 360 } : undefined}
          transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: 'linear' } : undefined}
        >
          <RefreshCw className="h-5 w-5 text-primary-foreground" />
        </motion.div>
      </motion.div>

      {/* Content */}
      <div>
        {children}
      </div>
    </div>
  );
}
