import { NavLink, useLocation } from 'react-router-dom';
import { Home, Coffee, ShoppingBag, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/stores/cartStore';

const navItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/menu', icon: Coffee, label: 'Menu' },
  { path: '/cart', icon: ShoppingBag, label: 'Cart' },
  { path: '/reservations', icon: Calendar, label: 'Reserve' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export function BottomNavigation() {
  const location = useLocation();
  const cartCount = useCartStore((state) => state.getItemCount());

  // Hide on certain routes
  const hiddenRoutes = ['/', '/login', '/register', '/splash', '/checkout', '/payment', '/order-success'];
  if (hiddenRoutes.some((route) => location.pathname === route)) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border bottom-nav">
      <div className="max-w-md mx-auto flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center gap-1 w-16 h-full relative transition-colors',
                isActive ? 'text-accent' : 'text-muted-foreground'
              )}
            >
              <motion.div 
                className="relative"
                whileTap={{ scale: 0.85 }}
                animate={isActive ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Icon className="h-5 w-5" />
                {item.path === '/cart' && cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}
              </motion.div>
              <motion.span 
                className="text-xs font-medium"
                animate={isActive ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {item.label}
              </motion.span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-1 bg-accent rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}