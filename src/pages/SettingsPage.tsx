import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Camera, Bell, Moon, Globe, Shield, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuthStore } from '@/stores/authStore';
import { useLanguageStore, Language } from '@/stores/languageStore';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ImageCropDialog } from '@/components/profile/ImageCropDialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const { language, setLanguage, t } = useLanguageStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Crop state
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleSaveProfile = async () => {
    if (user) {
      await supabase.from('profiles').update({ name: editName, phone: editPhone }).eq('user_id', user.id);
      setUser({ ...user, name: editName, phone: editPhone });
      toast({ title: t('toast.profileUpdated'), description: t('toast.profileSaved') });
      setShowProfileEdit(false);
    }
  };

  const handleChangePhoto = () => fileInputRef.current?.click();

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: t('toast.error'), description: 'Please select an image file', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: t('toast.error'), description: 'Image must be less than 5MB', variant: 'destructive' });
      return;
    }

    setPendingFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result as string);
      setShowCropDialog(true);
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCroppedImage = async (croppedBlob: Blob) => {
    if (!user) return;
    setUploading(true);
    try {
      const filePath = `${user.id}/avatar.jpg`;
      const file = new File([croppedBlob], 'avatar.jpg', { type: 'image/jpeg' });

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const avatarUrl = `${publicUrl}?t=${Date.now()}`;

      await supabase.from('profiles').update({ avatar_url: avatarUrl }).eq('user_id', user.id);
      setUser({ ...user, avatar: avatarUrl });
      toast({ title: t('toast.photoUpdated') });
    } catch (error: any) {
      toast({ title: t('toast.photoFailed'), description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
      setPendingFile(null);
    }
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setShowLanguageDialog(false);
    toast({ title: t('toast.langChanged'), description: lang === 'id' ? 'Bahasa Indonesia' : 'English' });
  };

  const languages = [
    { code: 'id' as Language, label: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'en' as Language, label: 'English', flag: '🇺🇸' },
  ];

  const settingsGroups = [
    {
      title: t('settings.account'),
      items: [
        { icon: User, label: t('settings.editProfile'), description: t('settings.editProfileDesc'), action: () => setShowProfileEdit(true), type: 'link' as const },
        { icon: Camera, label: t('settings.changePhoto'), description: uploading ? t('common.uploading') : t('settings.changePhotoDesc'), action: handleChangePhoto, type: 'link' as const },
      ],
    },
    {
      title: t('settings.preferences'),
      items: [
        { icon: Bell, label: t('settings.notifications'), description: t('settings.notificationsDesc'), value: notifications, onChange: setNotifications, type: 'switch' as const },
        { icon: Moon, label: t('settings.darkMode'), description: t('settings.darkModeDesc'), value: darkMode, onChange: setDarkMode, type: 'switch' as const },
      ],
    },
    {
      title: t('settings.other'),
      items: [
        { icon: Globe, label: t('settings.language'), description: language === 'id' ? 'Bahasa Indonesia' : 'English', type: 'link' as const, action: () => setShowLanguageDialog(true) },
        { icon: Shield, label: t('settings.privacy'), description: t('settings.privacyDesc'), type: 'link' as const, action: () => {} },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelected} />

      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-4 px-4 h-14">
          <Link to="/profile" className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-display font-bold text-lg">{t('settings.title')}</h1>
        </div>
      </header>

      <main className="p-4 pb-24 space-y-6">
        {settingsGroups.map((group, groupIndex) => (
          <motion.div key={group.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: groupIndex * 0.1 }}>
            <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-1">{group.title}</h2>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {group.items.map((item, index) => (
                <motion.div
                  key={item.label}
                  whileHover={{ backgroundColor: 'hsl(var(--muted) / 0.3)' }}
                  whileTap={{ scale: 0.99 }}
                  className={`flex items-center gap-4 p-4 cursor-pointer ${index !== group.items.length - 1 ? 'border-b border-border' : ''}`}
                  onClick={item.type === 'link' ? item.action : undefined}
                >
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  {item.type === 'switch' && <Switch checked={item.value} onCheckedChange={item.onChange} />}
                  {item.type === 'link' && <ChevronRight className="h-5 w-5 text-muted-foreground" />}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">Kopi Klasik v1.0.0</p>
        </div>
      </main>

      {/* Edit Profile Dialog */}
      <Dialog open={showProfileEdit} onOpenChange={setShowProfileEdit}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t('settings.editProfile')}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>{t('settings.name')}</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <Label>{t('settings.phone')}</Label>
              <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="Your phone number" />
            </div>
            <div className="space-y-2">
              <Label>{t('settings.email')}</Label>
              <Input value={user?.email || ''} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">{t('settings.emailHint')}</p>
            </div>
            <Button variant="accent" className="w-full" onClick={handleSaveProfile}>{t('settings.save')}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Language Selection Dialog */}
      <Dialog open={showLanguageDialog} onOpenChange={setShowLanguageDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>{t('settings.selectLanguage')}</DialogTitle></DialogHeader>
          <div className="space-y-2 pt-2">
            {languages.map((lang) => (
              <motion.button
                key={lang.code}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                  language === lang.code ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="flex-1 text-left font-medium">{lang.label}</span>
                {language === lang.code && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500 }}>
                    <Check className="h-5 w-5 text-primary" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Crop Dialog */}
      {cropImageSrc && (
        <ImageCropDialog
          open={showCropDialog}
          onClose={() => { setShowCropDialog(false); setCropImageSrc(null); }}
          imageSrc={cropImageSrc}
          onCropComplete={handleCroppedImage}
        />
      )}
    </div>
  );
}
