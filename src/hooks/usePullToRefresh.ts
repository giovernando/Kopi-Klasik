import { useState, useCallback, useRef } from 'react';
import { PanInfo } from 'framer-motion';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
}

export function usePullToRefresh({ onRefresh, threshold = 80 }: UsePullToRefreshOptions) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const isPulling = useRef(false);

  const handlePanStart = useCallback((event: PointerEvent) => {
    // Only start pull if at the top of the page
    if (window.scrollY <= 0) {
      startY.current = event.clientY;
      isPulling.current = true;
    }
  }, []);

  const handlePan = useCallback((event: PointerEvent, info: PanInfo) => {
    if (!isPulling.current || isRefreshing) return;
    
    const distance = Math.max(0, info.offset.y);
    setPullDistance(Math.min(distance, threshold * 1.5));
  }, [isRefreshing, threshold]);

  const handlePanEnd = useCallback(async () => {
    if (!isPulling.current) return;
    isPulling.current = false;

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
    
    setPullDistance(0);
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

  const progress = Math.min(pullDistance / threshold, 1);

  return {
    isRefreshing,
    pullDistance,
    progress,
    handlers: {
      onPanStart: handlePanStart,
      onPan: handlePan,
      onPanEnd: handlePanEnd,
    },
  };
}
