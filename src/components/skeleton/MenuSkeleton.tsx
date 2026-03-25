import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

interface MenuSkeletonProps {
  count?: number;
}

export function MenuCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-card">
      <Skeleton className="aspect-square w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-5 w-1/2" />
      </div>
    </div>
  );
}

export function MenuGridSkeleton({ count = 6 }: MenuSkeletonProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
        >
          <MenuCardSkeleton />
        </motion.div>
      ))}
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
          <Skeleton className="w-16 h-16 rounded-full" />
          <Skeleton className="h-3 w-12" />
        </div>
      ))}
    </div>
  );
}

export function PromoCarouselSkeleton() {
  return (
    <Skeleton className="w-full h-40 rounded-2xl" />
  );
}

export function HomePageSkeleton() {
  return (
    <div className="space-y-5 pt-4">
      <PromoCarouselSkeleton />
      
      <section>
        <Skeleton className="h-6 w-24 mb-3" />
        <CategorySkeleton />
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <MenuGridSkeleton count={6} />
      </section>
    </div>
  );
}
