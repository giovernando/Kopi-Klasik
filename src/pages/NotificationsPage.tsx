import { motion } from 'framer-motion';
import { ArrowLeft, Package, Tag, Bell, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface Notification {
  id: string;
  type: 'order' | 'promo' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'Order Delivered!',
    message: 'Your order #ORD-001 has been delivered successfully.',
    time: '2 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'promo',
    title: 'Weekend Special 🎉',
    message: 'Get 35% off on all coffee drinks this weekend!',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    type: 'order',
    title: 'Order Confirmed',
    message: 'Your order #ORD-002 is being prepared.',
    time: '3 hours ago',
    read: true,
  },
  {
    id: '4',
    type: 'system',
    title: 'Welcome to Kopi Klasik!',
    message: 'Thanks for joining us. Enjoy your first order with 20% off!',
    time: 'Yesterday',
    read: true,
  },
  {
    id: '5',
    type: 'promo',
    title: 'Free Delivery',
    message: 'Free delivery on orders above Rp 50.000 this month!',
    time: '2 days ago',
    read: true,
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'order':
      return <Package className="h-5 w-5 text-primary" />;
    case 'promo':
      return <Tag className="h-5 w-5 text-green-500" />;
    default:
      return <Bell className="h-5 w-5 text-blue-500" />;
  }
};

export default function NotificationsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-display font-semibold">Notifications</h1>
          <Button variant="ghost" size="sm" className="ml-auto text-primary text-sm">
            Mark all read
          </Button>
        </div>
      </header>

      {/* Notifications List */}
      <div className="px-4 py-4 space-y-3">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-card border border-border rounded-xl p-4 flex gap-3 ${
              !notification.read ? 'border-l-4 border-l-primary' : ''
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className={`font-medium text-foreground ${!notification.read ? 'font-semibold' : ''}`}>
                  {notification.title}
                </h3>
                {!notification.read && (
                  <span className="h-2 w-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                {notification.message}
              </p>
              <span className="text-xs text-muted-foreground mt-2 block">{notification.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
