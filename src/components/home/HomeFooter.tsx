import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

import logoImage from '@/assets/logo-circle.png';

export function HomeFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="relative mt-12 pb-28 overflow-hidden"
    >
      {/* Elegant dark background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, hsl(355 73% 21%) 0%, hsl(355 65% 15%) 100%)',
        }}
      />
      
      {/* Top border accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[hsl(50_75%_76%)] to-transparent" />

      <div className="relative z-10 px-6 py-8">
        {/* Brand & Tagline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full overflow-hidden mb-3" style={{ boxShadow: '0 4px 12px rgba(184, 115, 51, 0.3)' }}>
            <img src={logoImage} alt="Kopi Klasik Logo" className="w-14 h-14 object-cover rounded-full" />
          </div>
          <h3 className="font-display text-xl font-bold text-[hsl(50_75%_76%)] mb-2">
            Kopi Klasik
          </h3>
          <p className="text-[hsl(50_40%_80%/0.7)] text-sm max-w-xs mx-auto leading-relaxed">
            Kopi Klasik sejak 2019. Mengutamakan kualitas & rasa dalam setiap cangkir.
          </p>
        </motion.div>

        {/* Navigation Links */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-6 mb-6"
        >
          <NavLink to="/about" className="text-[hsl(50_40%_80%/0.7)] text-sm hover:text-[hsl(50_75%_76%)] transition-colors">
            About
          </NavLink>
          <NavLink to="/contact" className="text-[hsl(50_40%_80%/0.7)] text-sm hover:text-[hsl(50_75%_76%)] transition-colors">
            Contact
          </NavLink>
          <NavLink to="/faq" className="text-[hsl(50_40%_80%/0.7)] text-sm hover:text-[hsl(50_75%_76%)] transition-colors">
            FAQ
          </NavLink>
          <NavLink to="/terms" className="text-[hsl(50_40%_80%/0.7)] text-sm hover:text-[hsl(50_75%_76%)] transition-colors">
            Terms
          </NavLink>
        </motion.div>

        {/* Copyright */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center pt-4 border-t border-[hsl(50_75%_76%/0.15)]"
        >
          <p className="text-[hsl(50_40%_70%/0.5)] text-xs">
            © {currentYear} Kopi Klasik. All rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
