import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import logoImage from '@/assets/logo-circle.png';

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #3A2A1E 0%, #1F140E 100%)'
      }}
    >
      {/* Subtle coffee bean pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-16 h-16 rounded-full border-2 border-white/20" />
        <div className="absolute top-40 right-20 w-8 h-8 rounded-full border border-white/10" />
        <div className="absolute bottom-32 left-20 w-12 h-12 rounded-full border border-white/15" />
        <div className="absolute bottom-20 right-10 w-20 h-20 rounded-full border-2 border-white/10" />
      </div>

      {/* Logo Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.16, 1, 0.3, 1]
        }}
        className="relative z-10"
      >
        {/* Glow effect behind logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="absolute inset-0 blur-3xl"
          style={{ backgroundColor: '#B87333' }}
        />
        
        {/* Logo circle with image */}
        <div 
          className="w-28 h-28 rounded-full flex items-center justify-center relative overflow-hidden"
          style={{ 
            boxShadow: '0 20px 60px -10px rgba(184, 115, 51, 0.5)'
          }}
        >
          <img 
            src={logoImage} 
            alt="Kopi Klasik Logo" 
            className="w-28 h-28 object-cover rounded-full"
          />
        </div>
      </motion.div>

      {/* Brand Name */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
        className="mt-8 text-4xl font-display font-bold tracking-tight"
        style={{ color: '#F7F1EB' }}
      >
        Kopi Klasik
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mt-3 text-lg font-light tracking-wide"
        style={{ color: 'rgba(247, 241, 235, 0.6)' }}
      >
        Fresh Coffee, Easy Order
      </motion.p>

      {/* Loading indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 flex gap-2"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: '#B87333' }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut'
            }}
          />
        ))}
      </motion.div>

      {/* Bottom decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-12 w-16 h-0.5 rounded-full"
        style={{ backgroundColor: 'rgba(184, 115, 51, 0.3)' }}
      />
    </div>
  );
}
