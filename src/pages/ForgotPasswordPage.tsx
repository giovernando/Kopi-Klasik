import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Coffee, Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useLanguageStore } from '@/stores/languageStore';
import { supabase } from '@/integrations/supabase/client';

import coffeeHeroImage from '@/assets/categories/coffee.jpg';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const { t } = useLanguageStore();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast({ title: t('toast.error'), description: t('login.emailPlaceholder'), variant: 'destructive' }); return; }

    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    setIsLoading(false);
    
    if (error) { toast({ title: t('toast.error'), description: error.message, variant: 'destructive' }); return; }
    setIsSubmitted(true);
    toast({ title: t('toast.emailSent'), description: t('toast.checkInbox') });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F7F1EB' }}>
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${coffeeHeroImage})` }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(31, 20, 14, 0.7) 0%, rgba(31, 20, 14, 0.85) 100%)' }} />
        <Link to="/login" className="absolute top-6 left-6 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <div className="relative z-10 h-full flex flex-col items-center justify-center pt-4">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="w-14 h-14 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: '#B87333', boxShadow: '0 8px 32px -8px rgba(184, 115, 51, 0.6)' }}>
            <Coffee className="w-7 h-7 text-white" strokeWidth={1.5} />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg font-display font-semibold text-white">Kopi Klasik</motion.h2>
        </div>
        <div className="absolute -bottom-1 left-0 right-0 h-8" style={{ background: '#F7F1EB', borderTopLeftRadius: '2rem', borderTopRightRadius: '2rem' }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="flex-1 px-6 -mt-4">
        <div className="bg-white rounded-3xl p-6 shadow-xl" style={{ boxShadow: '0 10px 40px -10px rgba(43, 31, 22, 0.15)' }}>
          {!isSubmitted ? (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-display font-bold mb-2" style={{ color: '#2B1F16' }}>{t('forgot.title')}</h1>
                <p className="text-sm" style={{ color: '#6B5C52' }}>{t('forgot.subtitle')}</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: '#2B1F16' }}>{t('forgot.email')}</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: '#9C8B80' }} />
                    <Input type="email" placeholder={t('forgot.emailPlaceholder')} value={email} onChange={(e) => setEmail(e.target.value)} className="pl-12 h-12 rounded-xl border-2 transition-all duration-200 focus:ring-2" style={{ borderColor: '#E8DED6', backgroundColor: '#FDFBF9' }} />
                  </div>
                </div>
                <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-full text-base font-semibold" style={{ backgroundColor: '#B87333', color: 'white', boxShadow: '0 8px 24px -8px rgba(184, 115, 51, 0.5)' }}>
                  {isLoading ? (<><Loader2 className="h-5 w-5 animate-spin mr-2" />{t('forgot.submitting')}</>) : (t('forgot.submit'))}
                </Button>
              </form>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(184, 115, 51, 0.1)' }}>
                <CheckCircle className="w-8 h-8" style={{ color: '#B87333' }} />
              </div>
              <h2 className="text-xl font-display font-bold mb-2" style={{ color: '#2B1F16' }}>{t('forgot.successTitle')}</h2>
              <p className="text-sm mb-6" style={{ color: '#6B5C52' }}>
                {t('forgot.successDesc')} <strong style={{ color: '#2B1F16' }}>{email}</strong>. {t('forgot.checkInbox')}
              </p>
              <Button onClick={() => setIsSubmitted(false)} variant="outline" className="rounded-full px-6 border-2" style={{ borderColor: '#E8DED6', color: '#2B1F16' }}>
                {t('forgot.resend')}
              </Button>
            </motion.div>
          )}
        </div>

        <div className="text-center py-6">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: '#B87333' }}>
            <ArrowLeft className="w-4 h-4" />
            {t('forgot.backToLogin')}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
