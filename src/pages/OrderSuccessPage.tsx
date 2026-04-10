import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Home, MapPin, UtensilsCrossed, Store, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrderStore } from '@/stores/orderStore';
import { useLanguageStore } from '@/stores/languageStore';
import { toast } from 'sonner';
import { DeliveryMethod } from '@/types';

export default function OrderSuccessPage() {
  const currentOrder = useOrderStore((s) => s.currentOrder);
  const { t } = useLanguageStore();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const method = (currentOrder?.deliveryMethod as DeliveryMethod) || 'pickup';

  const ORDER_ESTIMATES: Record<DeliveryMethod, { label: string; time: string; icon: typeof Clock }> = {
    dine_in: { label: t('orderSuccess.servedToTable'), time: '10-15 min', icon: UtensilsCrossed },
    pickup: { label: t('orderSuccess.readyIn'), time: '15-20 min', icon: Store },
    delivery: { label: t('orderSuccess.deliveryEstimate'), time: '30-45 min', icon: Truck },
  };

  const estimate = ORDER_ESTIMATES[method];
  const EstimateIcon = estimate.icon;

  useEffect(() => {
    if (currentOrder) {
      toast.success(t('orderSuccess.toast'), {
        description: `Order ${currentOrder.id} ${t('orderSuccess.toastDesc')}`,
        duration: 5000,
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
        <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-12 w-12 text-success" />
        </div>
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-2xl font-display font-bold mb-2">
        {t('orderSuccess.title')}
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-muted-foreground mb-6">
        {t('orderSuccess.subtitle')}
      </motion.p>

      {currentOrder && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card border border-border rounded-2xl p-5 w-full max-w-sm mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <EstimateIcon className="h-5 w-5 text-accent" />
            </div>
            <div className="text-left">
              <p className="text-sm text-muted-foreground">{estimate.label}</p>
              <p className="font-bold text-lg">{estimate.time}</p>
            </div>
          </div>

          <div className="border-t border-border pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('orderSuccess.orderId')}</span>
              <span className="font-mono font-semibold">{currentOrder.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('orderSuccess.orderType')}</span>
              <span className="font-medium capitalize">{method === 'dine_in' ? 'Dine In' : method === 'pickup' ? 'Pickup' : 'Delivery'}</span>
            </div>
            {currentOrder.tableNumber && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('orderSuccess.tableNumber')}</span>
                <span className="font-semibold">{currentOrder.tableNumber}</span>
              </div>
            )}
            {currentOrder.pickupTime && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('orderSuccess.pickupTime')}</span>
                <span className="font-semibold">{currentOrder.pickupTime}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
              <span>{t('orderSuccess.total')}</span>
              <span className="text-accent">{formatPrice(currentOrder.total || 0)}</span>
            </div>
          </div>
        </motion.div>
      )}

      <div className="space-y-3 w-full max-w-sm">
        {currentOrder?.id && (
          <Button variant="accent" size="lg" className="w-full" asChild>
            <Link to={`/orders/${currentOrder.id}`}><MapPin className="h-5 w-5 mr-2" />{t('orderSuccess.trackOrder')}</Link>
          </Button>
        )}
        <Button variant="outline" size="lg" className="w-full" asChild>
          <Link to="/home"><Home className="h-5 w-5 mr-2" />{t('orderSuccess.backHome')}</Link>
        </Button>
      </div>
    </div>
  );
}
