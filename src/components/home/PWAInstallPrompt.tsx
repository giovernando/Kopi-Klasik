import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useState, useEffect } from 'react';

import logoImage from '@/assets/logo-circle.png';

interface PWAInstallPromptProps {
  /** If true, shows even without native install prompt (e.g. on login page) */
  alwaysShow?: boolean;
}

export function PWAInstallPrompt({ alwaysShow = false }: PWAInstallPromptProps) {
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = new Date(dismissed).getTime();
      const now = new Date().getTime();
      if (now - dismissedTime > 7 * 24 * 60 * 60 * 1000) {
        localStorage.removeItem('pwa-install-dismissed');
      } else {
        setIsDismissed(true);
      }
    }

    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
  };

  const handleInstall = async () => {
    if (isInstallable) {
      const installed = await promptInstall();
      if (installed) {
        setIsDismissed(true);
      }
    }
  };

  const canShow = alwaysShow || isInstallable;

  if (isInstalled || isDismissed || !canShow || !showPrompt) {
    return null;
  }

  // Check if iOS for share instructions
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="fixed bottom-6 left-4 right-4 z-[60] max-w-md mx-auto"
      >
        <div 
          className="relative rounded-2xl p-4 shadow-2xl border border-border overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #3A2A1E 0%, #2B1F16 100%)',
          }}
        >
          {/* Decorative glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #B87333 0%, transparent 70%)' }} />

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-white/40 hover:text-white/80 transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-start gap-3.5">
            {/* App Icon */}
            <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg" style={{ boxShadow: '0 4px 16px rgba(184, 115, 51, 0.4)' }}>
              <img src={logoImage} alt="Kopi Klasik" className="w-14 h-14 object-cover" />
            </div>

            {/* Content */}
            <div className="flex-1 pr-5">
              <h3 className="font-display font-bold text-white text-base mb-0.5">
                Install Kopi Klasik
              </h3>
              <p className="text-xs text-white/60 mb-3 leading-relaxed">
                {isIOS 
                  ? 'Tap tombol Share lalu "Add to Home Screen"' 
                  : 'Tambahkan ke layar utama untuk akses cepat & offline'
                }
              </p>

              <div className="flex gap-2">
                {isInstallable ? (
                  <Button
                    onClick={handleInstall}
                    size="sm"
                    className="gap-1.5 rounded-full text-xs font-semibold h-8 px-4"
                    style={{ backgroundColor: '#B87333', color: 'white' }}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Install
                  </Button>
                ) : isIOS ? (
                  <div className="flex items-center gap-1.5 text-xs text-white/50">
                    <Share className="h-3.5 w-3.5" />
                    <span>Gunakan tombol Share</span>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      // Try to trigger via browser menu hint
                      handleDismiss();
                    }}
                    size="sm"
                    variant="outline"
                    className="gap-1.5 rounded-full text-xs font-semibold h-8 px-4 border-white/20 text-white hover:bg-white/10"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Install via Browser
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
