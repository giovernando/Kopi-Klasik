import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Home, Coffee, ClipboardList, ShoppingCart, User } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/stores/cartStore';
import { haptics } from '@/utils/haptics';

const navItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/menu', icon: Coffee, label: 'Menu' },
  { path: '/orders', icon: ClipboardList, label: 'Order' },
  { path: '/cart', icon: ShoppingCart, label: 'Cart' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export function FloatingBottomNav() {
  const location = useLocation();
  const cartCount = useCartStore((state) => state.getItemCount());
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const { scrollY } = useScroll();

  // Track scroll direction
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 100) {
      setIsScrollingDown(true);
    } else {
      setIsScrollingDown(false);
    }
  });

  // Hide on certain routes
  const hiddenRoutes = ['/', '/login', '/register', '/splash', '/checkout', '/payment', '/order-success', '/forgot-password', '/reset-password'];
  if (hiddenRoutes.some((route) => location.pathname === route)) {
    return null;
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: 50 }}
      animate={{ 
        opacity: isScrollingDown ? 0.9 : 1, 
        y: 0,
        scale: isScrollingDown ? 0.96 : 1,
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 120, 
        damping: 18 
      }}
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe-bottom"
    >
      <div className="max-w-xs mx-auto mb-3">
        {/* Glassmorphism Container */}
        <motion.div 
          className="rounded-full py-2 px-2 shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
          style={{
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
          }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center justify-between gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => haptics.selection()}
                  className="flex-shrink-0 relative"
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                    className={cn(
                      'relative flex items-center justify-center w-[48px] h-[48px] rounded-full transition-colors duration-200'
                    )}
                  >
                    {/* Animated Active Background Pill */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavPill"
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: 'linear-gradient(135deg, hsl(355 73% 21%) 0%, hsl(355 65% 30%) 100%)',
                          boxShadow: '0 4px 12px hsl(355 65% 30% / 0.4)',
                        }}
                        transition={{ 
                          type: 'spring', 
                          stiffness: 500, 
                          damping: 30 
                        }}
                      />
                    )}
                    
                    <Icon 
                      className={cn(
                        'w-5 h-5 flex-shrink-0 transition-colors duration-200 relative z-10',
                        isActive 
                          ? 'text-white' 
                          : 'text-muted-foreground'
                      )} 
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    
                    {/* Cart Badge */}
                    {item.path === '/cart' && cartCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        className="absolute -top-0.5 -right-0.5 bg-destructive text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-md z-20"
                      >
                        {cartCount > 99 ? '99+' : cartCount}
                      </motion.span>
                    )}
                  </motion.div>
                </NavLink>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
