import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import { lovable } from '@/integrations/lovable/index';

import coffeeHeroImage from '@/assets/categories/coffee.jpg';
import logoImage from '@/assets/logo-circle.png';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoogleRegister = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      toast({ title: 'Daftar gagal', description: 'Gagal mendaftar dengan Google', variant: 'destructive' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast({ title: 'Field belum lengkap', description: 'Harap isi semua field', variant: 'destructive' });
      return;
    }

    if (password !== confirmPassword) {
      toast({ title: 'Password tidak cocok', description: 'Pastikan password sama', variant: 'destructive' });
      return;
    }

    if (password.length < 6) {
      toast({ title: 'Password terlalu pendek', description: 'Minimal 6 karakter', variant: 'destructive' });
      return;
    }

    const result = await register(name, email, password);
    
    if (result.success && result.message === 'verification_needed') {
      toast({
        title: 'Cek email Anda!',
        description: 'Kami telah mengirim email verifikasi. Silakan verifikasi sebelum login.',
      });
      navigate('/login');
    } else if (result.success && result.message === 'auto_confirmed') {
      toast({ title: 'Selamat datang di Brew & Bean!', description: 'Akun berhasil dibuat.' });
      navigate('/home');
    } else {
      toast({ title: 'Registrasi gagal', description: result.message || 'Terjadi kesalahan', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F7F1EB' }}>
      {/* Hero Section */}
      <div className="relative h-44 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${coffeeHeroImage})` }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(31, 20, 14, 0.7) 0%, rgba(31, 20, 14, 0.85) 100%)' }} />
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="w-14 h-14 rounded-full flex items-center justify-center mb-2 overflow-hidden" style={{ boxShadow: '0 8px 32px -8px rgba(184, 115, 51, 0.6)' }}>
            <img src={logoImage} alt="Kopi Klasik Logo" className="w-14 h-14 object-cover rounded-full" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg font-display font-semibold text-white">
            Kopi Klasik
          </motion.h2>
        </div>

        <div className="absolute -bottom-1 left-0 right-0 h-8" style={{ background: '#F7F1EB', borderTopLeftRadius: '2rem', borderTopRightRadius: '2rem' }} />
      </div>

      {/* Register Card */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="flex-1 px-6 -mt-4 pb-6">
        <div className="bg-white rounded-3xl p-6 shadow-xl" style={{ boxShadow: '0 10px 40px -10px rgba(43, 31, 22, 0.15)' }}>
          <div className="text-center mb-5">
            <h1 className="text-2xl font-display font-bold mb-1" style={{ color: '#2B1F16' }}>Buat Akun</h1>
            <p className="text-sm" style={{ color: '#6B5C52' }}>Bergabung untuk menikmati kopi terbaik</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: '#2B1F16' }}>Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: '#9C8B80' }} />
                <Input type="text" placeholder="Masukkan nama lengkap" value={name} onChange={(e) => setName(e.target.value)} className="pl-12 h-12 rounded-xl border-2" style={{ borderColor: '#E8DED6', backgroundColor: '#FDFBF9' }} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: '#2B1F16' }}>Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: '#9C8B80' }} />
                <Input type="email" placeholder="Masukkan email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-12 h-12 rounded-xl border-2" style={{ borderColor: '#E8DED6', backgroundColor: '#FDFBF9' }} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: '#2B1F16' }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: '#9C8B80' }} />
                <Input type={showPassword ? 'text' : 'password'} placeholder="Buat password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-12 pr-12 h-12 rounded-xl border-2" style={{ borderColor: '#E8DED6', backgroundColor: '#FDFBF9' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: '#9C8B80' }}>
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: '#2B1F16' }}>Konfirmasi Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: '#9C8B80' }} />
                <Input type={showPassword ? 'text' : 'password'} placeholder="Konfirmasi password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-12 h-12 rounded-xl border-2" style={{ borderColor: '#E8DED6', backgroundColor: '#FDFBF9' }} />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-full text-base font-semibold mt-2" style={{ backgroundColor: '#B87333', color: 'white', boxShadow: '0 8px 24px -8px rgba(184, 115, 51, 0.5)' }}>
              {isLoading ? (<><Loader2 className="h-5 w-5 animate-spin mr-2" />Membuat akun...</>) : ('Daftar')}
            </Button>

            <p className="text-center text-xs pt-2" style={{ color: '#9C8B80' }}>
              Dengan mendaftar, Anda menyetujui{' '}
              <button type="button" className="font-medium" style={{ color: '#B87333' }}>Syarat & Ketentuan</button>{' '}dan{' '}
              <button type="button" className="font-medium" style={{ color: '#B87333' }}>Kebijakan Privasi</button>
            </p>
          </form>

          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px" style={{ backgroundColor: '#E8DED6' }} />
            <span className="text-sm" style={{ color: '#9C8B80' }}>atau</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#E8DED6' }} />
          </div>

          <Button 
            type="button" 
            variant="outline" 
            className="w-full h-12 rounded-xl border-2 font-medium" 
            style={{ borderColor: '#E8DED6', color: '#2B1F16', backgroundColor: 'white' }}
            onClick={handleGoogleRegister}
          >
            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Daftar dengan Google
          </Button>
        </div>

        <div className="text-center py-5">
          <p className="text-sm" style={{ color: '#6B5C52' }}>
            Sudah punya akun?{' '}
            <Link to="/login" className="font-semibold" style={{ color: '#B87333' }}>Masuk</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
