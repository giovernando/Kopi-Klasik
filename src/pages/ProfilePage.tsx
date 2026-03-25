import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  Package, 
  Gift, 
  Phone, 
  ChevronRight, 
  Edit3,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PWAInstallPrompt } from '@/components/home/PWAInstallPrompt';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: MapPin, label: 'Manage Address', action: () => navigate('/manage-address') },
    { icon: CreditCard, label: 'Payment', action: () => navigate('/payment-methods') },
    { icon: Package, label: 'Orders', action: () => navigate('/orders') },
    { icon: Gift, label: 'Offer', action: () => navigate('/offers') },
    { icon: Phone, label: 'Help Center', action: () => navigate('/help-support') },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-display font-semibold">Profile</h1>
        </div>
      </header>

      <div className="px-4 pt-6 space-y-6">
        {/* Profile Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-5 shadow-card border border-border"
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-lg font-display font-bold text-foreground">
                {user?.name || 'Guest User'}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-primary font-semibold">$15k+ Spend</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">@{user?.email?.split('@')[0] || 'guest'}</span>
              </div>
              {user?.role === 'admin' && (
                <span className="inline-block mt-2 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                  Admin
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
              onClick={() => navigate('/settings')}
            >
              <Edit3 className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        {/* Section Title */}
        <div>
          <h3 className="text-base font-semibold text-foreground">My Account</h3>
        </div>

        {/* Account Menu List */}
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={item.action}
              className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-xl active:scale-[0.98] transition-transform"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="flex-1 text-left font-medium text-foreground">{item.label}</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </motion.button>
          ))}
        </div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="outline"
            size="lg"
            className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Log Out
          </Button>
        </motion.div>
      </div>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
}
