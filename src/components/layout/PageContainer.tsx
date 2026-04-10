import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  rightAction?: ReactNode;
  className?: string;
  noPadding?: boolean;
  noBottomNav?: boolean;
}

export function PageContainer({
  children,
  title,
  showBack = false,
  rightAction,
  className,
  noPadding = false,
  noBottomNav = false,
}: PageContainerProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        'min-h-screen bg-background',
        !noBottomNav && 'pb-24',
        className
      )}
    >
      {/* Header */}
      {(title || showBack || rightAction) && (
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border safe-top">
          <div className="flex items-center justify-between h-14 px-4">
            <div className="flex items-center gap-2">
              {showBack && (
                <Button
                  variant="ghost"
                  size="iconSm"
                  onClick={() => navigate(-1)}
                  className="rounded-full"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              )}
              {title && (
                <h1 className="text-lg font-semibold font-display">{title}</h1>
              )}
            </div>
            {rightAction}
          </div>
        </header>
      )}

      {/* Content */}
      <main className={cn(!noPadding && 'px-4 py-4')}>{children}</main>
    </motion.div>
  );
}
