import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { haptics } from '@/utils/haptics';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function TopNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/home';

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="sticky top-0 z-50 px-4 pt-safe-top"
    >
      <div className="bg-card/95 backdrop-blur-md rounded-2xl shadow-card mt-3 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: User Avatar */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              haptics.light();
              navigate('/profile');
            }}
          >
            <Avatar className="w-10 h-10 border-2 border-accent/20">
              <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80" />
              <AvatarFallback className="bg-accent text-accent-foreground font-semibold">
                U
              </AvatarFallback>
            </Avatar>
          </motion.button>

          {/* Center: Animated Brand Name */}
          <motion.div 
            className="flex items-center gap-1"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              delay: 0.2, 
              type: 'spring', 
              stiffness: 200, 
              damping: 15 
            }}
          >
            <motion.span 
              className="font-display text-xl font-bold text-foreground tracking-tight"
              animate={isHomePage ? {
                textShadow: [
                  '0 0 0px hsl(28 85% 55% / 0)',
                  '0 0 10px hsl(28 85% 55% / 0.3)',
                  '0 0 0px hsl(28 85% 55% / 0)',
                ],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              Kopi
            </motion.span>
            <motion.span 
              className="w-2 h-2 rounded-full bg-accent"
              animate={isHomePage ? {
                scale: [1, 1.3, 1],
                opacity: [1, 0.7, 1],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.span 
              className="font-display text-xl font-bold text-foreground tracking-tight"
              animate={isHomePage ? {
                textShadow: [
                  '0 0 0px hsl(28 85% 55% / 0)',
                  '0 0 10px hsl(28 85% 55% / 0.3)',
                  '0 0 0px hsl(28 85% 55% / 0)',
                ],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
            >
              Klasik
            </motion.span>
          </motion.div>

          {/* Right: Notification */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => {
              haptics.light();
              navigate('/notifications');
            }}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center relative"
          >
            <Bell className="h-5 w-5 text-foreground" />
            {/* Notification dot */}
            <motion.span 
              className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
