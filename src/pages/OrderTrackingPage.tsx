import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package } from 'lucide-react';
import { useOrderStore } from '@/stores/orderStore';
import OrderStatusTracker from '@/components/order/OrderStatusTracker';
import { DeliveryMap } from '@/components/order/DeliveryMap';
import { OrderRating } from '@/components/order/OrderRating';
import { DriverContact } from '@/components/order/DriverContact';
import { Button } from '@/components/ui/button';
import { OrderStatus } from '@/types';

export default function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const orders = useOrderStore((s) => s.orders);
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);
  const order = orders.find((o) => o.id === orderId);

  // Simulate real-time status updates for demo
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!order || order.status === 'completed' || order.status === 'cancelled') return;

    const statusProgression: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'completed'];
    const currentIndex = statusProgression.indexOf(order.status);

    // Skip 'delivering' for pickup orders
    const getNextStatus = () => {
      if (order.deliveryMethod === 'pickup' && order.status === 'ready') {
        return 'completed';
      }
      return statusProgression[currentIndex + 1];
    };

    const timer = setTimeout(() => {
      const nextStatus = getNextStatus();
      if (nextStatus) {
        updateOrderStatus(order.id, nextStatus);
        setTick((t) => t + 1);
      }
    }, 5000); // Update every 5 seconds for demo

    return () => clearTimeout(timer);
  }, [order, updateOrderStatus]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <Package className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-xl font-display font-bold mb-2">Order Not Found</h1>
        <p className="text-muted-foreground mb-6">This order doesn't exist or has been removed.</p>
        <Button variant="accent" asChild>
          <Link to="/home">Back to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-4 px-4 h-14">
          <Link to="/orders" className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display font-bold">Track Order</h1>
            <p className="text-xs text-muted-foreground font-mono">{order.id}</p>
          </div>
        </div>
      </header>

      <main className="p-4 pb-24 space-y-4">
        {/* Status Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <OrderStatusTracker
            status={order.status}
            deliveryMethod={order.deliveryMethod}
            estimatedDelivery={order.estimatedDelivery}
          />
        </motion.div>

        {/* Delivery Map & Driver Contact */}
        {order.deliveryMethod !== 'pickup' && order.status === 'delivering' && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl p-5"
            >
              <h3 className="font-display font-semibold mb-4">Live Tracking</h3>
              <DeliveryMap deliveryMethod={order.deliveryMethod as 'grab' | 'gojek'} />
            </motion.div>
            
            <DriverContact 
              deliveryMethod={order.deliveryMethod as 'grab' | 'gojek'} 
              driverName={order.deliveryMethod === 'grab' ? 'Ahmad R.' : 'Budi S.'}
            />
          </>
        )}

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-5"
        >
          <h3 className="font-display font-semibold mb-4">Order Items</h3>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-lg">☕</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.size && `${item.size} • `}Qty: {item.quantity}
                  </p>
                </div>
                <span className="font-semibold text-sm">{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span>{formatPrice(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
              <span>Total</span>
              <span className="text-accent">{formatPrice(order.total)}</span>
            </div>
          </div>
        </motion.div>

        {/* Delivery Address */}
        {order.deliveryAddress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-2xl p-5"
          >
            <h3 className="font-display font-semibold mb-2">Delivery Address</h3>
            <p className="text-muted-foreground text-sm">{order.deliveryAddress.fullAddress}</p>
          </motion.div>
        )}

        {/* Completion Message & Rating */}
        {order.status === 'completed' && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-success/10 border border-success/30 rounded-2xl p-5 text-center"
            >
              <p className="font-display font-semibold text-success">Order Completed!</p>
              <p className="text-sm text-muted-foreground mt-1">Thank you for your order. Enjoy your coffee!</p>
            </motion.div>
            
            <OrderRating orderId={order.id} />
          </>
        )}
      </main>
    </div>
  );
}
