import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Coffee, Lock, Eye, EyeOff, Loader2, CheckCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

import coffeeHeroImage from '@/assets/categories/coffee.jpg';

const passwordSchema = z.object({
  password: z.string()
    .min(8, 'Password minimal 8 karakter')
    .regex(/[A-Z]/, 'Password harus memiliki huruf besar')
    .regex(/[0-9]/, 'Password harus memiliki angka'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
});

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  // Parallax effect
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 300], [0, 100]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 1.15]);

  const validateForm = () => {
    const result = passwordSchema.safeParse({ password, confirmPassword });
    if (!result.success) {
      const fieldErrors: { password?: string; confirmPassword?: string } = {};
      result.error.errors.forEach(err => {
        const field = err.path[0] as 'password' | 'confirmPassword';
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    
    const { error } = await supabase.auth.updateUser({ password });
    
    setIsLoading(false);
    
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }
    
    setIsSuccess(true);
    
    toast({
      title: 'Password berhasil diubah!',
      description: 'Silakan login dengan password baru Anda.',
    });

    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strengthLabels = ['Lemah', 'Cukup', 'Baik', 'Kuat'];
  const strengthColors = ['#EF4444', '#F59E0B', '#10B981', '#059669'];
  const passwordStrength = getPasswordStrength();

  if (isSuccess) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ backgroundColor: '#F7F1EB' }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: '#10B981' }}
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-display font-bold text-center mb-2"
          style={{ color: '#2B1F16' }}
        >
          Password Berhasil Diubah!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-6"
          style={{ color: '#6B5C52' }}
        >
          Mengalihkan ke halaman login...
        </motion.p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex flex-col overflow-x-hidden"
      style={{ backgroundColor: '#F7F1EB' }}
    >
      {/* Hero Section with Parallax */}
      <div className="relative h-56 overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${coffeeHeroImage})`,
            y: heroY,
            scale: heroScale,
          }}
        />
        <div 
          className="absolute inset-0"
          style={{ 
            background: 'linear-gradient(180deg, rgba(31, 20, 14, 0.6) 0%, rgba(31, 20, 14, 0.85) 100%)'
          }}
        />
        
        {/* Logo and Brand */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
            style={{ 
              backgroundColor: '#B87333',
              boxShadow: '0 8px 32px -8px rgba(184, 115, 51, 0.6)'
            }}
          >
            <ShieldCheck className="w-8 h-8 text-white" strokeWidth={1.5} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl font-display font-semibold text-white"
          >
            Reset Password
          </motion.h2>
        </div>

        {/* Curved bottom */}
        <div 
          className="absolute -bottom-1 left-0 right-0 h-8"
          style={{
            background: '#F7F1EB',
            borderTopLeftRadius: '2rem',
            borderTopRightRadius: '2rem'
          }}
        />
      </div>

      {/* Reset Password Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex-1 px-6 -mt-4"
      >
        <div 
          className="bg-white rounded-3xl p-6 shadow-xl"
          style={{ 
            boxShadow: '0 10px 40px -10px rgba(43, 31, 22, 0.15)'
          }}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h1 
              className="text-2xl font-display font-bold mb-1"
              style={{ color: '#2B1F16' }}
            >
              Buat Password Baru
            </h1>
            <p 
              className="text-sm"
              style={{ color: '#6B5C52' }}
            >
              Password baru harus berbeda dari password sebelumnya
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password Input */}
            <div className="space-y-2">
              <label 
                className="text-sm font-medium"
                style={{ color: '#2B1F16' }}
              >
                Password Baru
              </label>
              <div className="relative">
                <Lock 
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5"
                  style={{ color: '#9C8B80' }}
                />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimal 8 karakter"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                  }}
                  className={`pl-12 pr-12 h-12 rounded-xl border-2 transition-all duration-200 ${
                    errors.password ? 'border-red-400' : ''
                  }`}
                  style={{ 
                    borderColor: errors.password ? undefined : '#E8DED6',
                    backgroundColor: '#FDFBF9'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: '#9C8B80' }}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password}</p>
              )}
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: passwordStrength >= level 
                            ? strengthColors[passwordStrength - 1] 
                            : '#E8DED6'
                        }}
                      />
                    ))}
                  </div>
                  <p 
                    className="text-xs"
                    style={{ color: strengthColors[passwordStrength - 1] || '#9C8B80' }}
                  >
                    {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : 'Masukkan password'}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label 
                className="text-sm font-medium"
                style={{ color: '#2B1F16' }}
              >
                Konfirmasi Password
              </label>
              <div className="relative">
                <Lock 
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5"
                  style={{ color: '#9C8B80' }}
                />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Ulangi password baru"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                  }}
                  className={`pl-12 pr-12 h-12 rounded-xl border-2 transition-all duration-200 ${
                    errors.confirmPassword ? 'border-red-400' : ''
                  }`}
                  style={{ 
                    borderColor: errors.confirmPassword ? undefined : '#E8DED6',
                    backgroundColor: '#FDFBF9'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: '#9C8B80' }}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword}</p>
              )}
              {confirmPassword && password === confirmPassword && !errors.confirmPassword && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Password cocok
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !password || !confirmPassword}
              className="w-full h-12 rounded-full text-base font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] mt-6"
              style={{ 
                backgroundColor: '#B87333',
                color: 'white',
                boxShadow: '0 8px 24px -8px rgba(184, 115, 51, 0.5)'
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Password Baru'
              )}
            </Button>
          </form>

          {/* Password Requirements */}
          <div 
            className="mt-6 p-4 rounded-xl"
            style={{ backgroundColor: 'rgba(184, 115, 51, 0.08)' }}
          >
            <p className="text-xs font-medium mb-2" style={{ color: '#B87333' }}>
              Persyaratan Password:
            </p>
            <ul className="text-xs space-y-1" style={{ color: '#6B5C52' }}>
              <li className="flex items-center gap-2">
                <span className={password.length >= 8 ? 'text-green-600' : ''}>
                  {password.length >= 8 ? '✓' : '○'}
                </span>
                Minimal 8 karakter
              </li>
              <li className="flex items-center gap-2">
                <span className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>
                  {/[A-Z]/.test(password) ? '✓' : '○'}
                </span>
                Minimal 1 huruf besar
              </li>
              <li className="flex items-center gap-2">
                <span className={/[0-9]/.test(password) ? 'text-green-600' : ''}>
                  {/[0-9]/.test(password) ? '✓' : '○'}
                </span>
                Minimal 1 angka
              </li>
            </ul>
          </div>
        </div>

        {/* Back to Login Link */}
        <div className="text-center py-6">
          <p className="text-sm" style={{ color: '#6B5C52' }}>
            Ingat password Anda?{' '}
            <Link 
              to="/login" 
              className="font-semibold transition-colors hover:opacity-80"
              style={{ color: '#B87333' }}
            >
              Kembali ke Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
