import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Home, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrderStore } from '@/stores/orderStore';

export default function OrderSuccessPage() {
  const currentOrder = useOrderStore((s) => s.currentOrder);
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
        <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-12 w-12 text-success" />
        </div>
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-2xl font-display font-bold mb-2">
        Order Placed!
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-muted-foreground mb-6">
        Your order has been confirmed and is being prepared
      </motion.p>

      {currentOrder && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card border border-border rounded-2xl p-5 w-full max-w-sm mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="h-5 w-5 text-accent" />
            <div className="text-left">
              <p className="text-sm text-muted-foreground">Estimated time</p>
              <p className="font-semibold">20-30 minutes</p>
            </div>
          </div>
          <div className="border-t border-border pt-4">
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="font-mono font-semibold">{currentOrder.id}</p>
            <p className="text-lg font-bold text-accent mt-2">{formatPrice(currentOrder.total || 0)}</p>
          </div>
        </motion.div>
      )}

      <div className="space-y-3 w-full max-w-sm">
        {currentOrder?.id && (
          <Button variant="accent" size="lg" className="w-full" asChild>
            <Link to={`/orders/${currentOrder.id}`}>
              <MapPin className="h-5 w-5 mr-2" />Track Order
            </Link>
          </Button>
        )}
        <Button variant="outline" size="lg" className="w-full" asChild>
          <Link to="/home"><Home className="h-5 w-5 mr-2" />Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
