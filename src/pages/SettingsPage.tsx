import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Camera, Bell, Moon, Globe, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const { toast } = useToast();
  
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  // Handle dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleSaveProfile = () => {
    if (user) {
      setUser({
        ...user,
        name: editName,
        phone: editPhone,
      });
      toast({
        title: 'Profile updated',
        description: 'Your profile has been saved.',
      });
      setShowProfileEdit(false);
    }
  };

  const handleChangePhoto = () => {
    // In a real app, this would open a file picker
    toast({
      title: 'Change Photo',
      description: 'Photo upload will be available with cloud integration.',
    });
  };

  const settingsGroups = [
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Edit Profile',
          description: 'Change your name and phone',
          action: () => setShowProfileEdit(true),
          type: 'link' as const,
        },
        {
          icon: Camera,
          label: 'Change Photo',
          description: 'Update your profile picture',
          action: handleChangePhoto,
          type: 'link' as const,
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell,
          label: 'Push Notifications',
          description: 'Receive order updates',
          value: notifications,
          onChange: setNotifications,
          type: 'switch' as const,
        },
        {
          icon: Moon,
          label: 'Dark Mode',
          description: 'Toggle dark theme',
          value: darkMode,
          onChange: setDarkMode,
          type: 'switch' as const,
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          icon: Globe,
          label: 'Language',
          description: 'English',
          type: 'link' as const,
          action: () => {},
        },
        {
          icon: Shield,
          label: 'Privacy Policy',
          description: 'View our privacy policy',
          type: 'link' as const,
          action: () => {},
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-4 px-4 h-14">
          <Link to="/profile" className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-display font-bold text-lg">Settings</h1>
        </div>
      </header>

      <main className="p-4 pb-24 space-y-6">
        {settingsGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
          >
            <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-1">{group.title}</h2>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {group.items.map((item, index) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-4 p-4 ${
                    index !== group.items.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  {item.type === 'switch' && (
                    <Switch
                      checked={item.value}
                      onCheckedChange={item.onChange}
                    />
                  )}
                  {item.type === 'link' && (
                    <button onClick={item.action} className="p-2">
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* App Version */}
        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">Kopi Klasik v1.0.0</p>
        </div>
      </main>

      {/* Edit Profile Dialog */}
      <Dialog open={showProfileEdit} onOpenChange={setShowProfileEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="Your phone number"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ''} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            <Button variant="accent" className="w-full" onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
