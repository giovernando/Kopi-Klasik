import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Clock, Check, ChevronRight, Coffee, History, RotateCcw, ShoppingCart } from 'lucide-react';
import { useOrderStore } from '@/stores/orderStore';
import { useCartStore } from '@/stores/cartStore';
import { PageContainer } from '@/components/layout/PageContainer';
import { Order, OrderStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { PWAInstallPrompt } from '@/components/home/PWAInstallPrompt';
import { toast } from 'sonner';

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: 'Pending', color: 'text-warning', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'text-info', icon: Check },
  preparing: { label: 'Preparing', color: 'text-accent', icon: Coffee },
  ready: { label: 'Ready', color: 'text-success', icon: Package },
  delivering: { label: 'On the Way', color: 'text-accent', icon: Package },
  completed: { label: 'Completed', color: 'text-success', icon: Check },
  cancelled: { label: 'Cancelled', color: 'text-destructive', icon: Clock },
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const orders = useOrderStore((s) => s.orders);
  const addItem = useCartStore((s) => s.addItem);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const handleReorder = (order: Order, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let itemsAdded = 0;
    order.items.forEach((item) => {
      if (item.product.isAvailable) {
        addItem(item.product, item.quantity, item.size, item.customizations, item.notes);
        itemsAdded += item.quantity;
      }
    });
    if (itemsAdded > 0) {
      toast.success(`${itemsAdded} item ditambahkan ke keranjang`, {
        action: { label: 'Lihat Keranjang', onClick: () => navigate('/cart') },
      });
    } else {
      toast.error('Tidak ada item yang tersedia');
    }
  };

  const activeOrders = orders.filter((o) => !['completed', 'cancelled'].includes(o.status));
  const pastOrders = orders.filter((o) => ['completed', 'cancelled'].includes(o.status));

  const historyButton = (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate('/order-history')}
      className="gap-1.5 text-muted-foreground"
    >
      <History className="h-4 w-4" />
      History
    </Button>
  );

  const renderOrderCard = (order: Order, index: number, isActive: boolean) => {
    const config = statusConfig[order.status];
    const StatusIcon = config.icon;

    return (
      <motion.div
        key={order.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Link
          to={`/orders/${order.id}`}
          className={`block bg-card border rounded-2xl p-4 transition-colors ${
            isActive ? 'border-accent/30 shadow-sm' : 'border-border hover:border-accent/50'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-sm font-semibold">{order.id}</span>
            <div className={`flex items-center gap-1.5 text-sm ${config.color}`}>
              <StatusIcon className="h-4 w-4" />
              <span className="font-medium">{config.label}</span>
            </div>
          </div>

          {/* Product Images */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex -space-x-2.5">
              {order.items.slice(0, 4).map((item, idx) => (
                <div
                  key={item.id}
                  className="w-11 h-11 rounded-xl border-2 border-card overflow-hidden bg-muted"
                  style={{ zIndex: 4 - idx }}
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {order.items.length > 4 && (
                <div
                  className="w-11 h-11 rounded-xl border-2 border-card bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground"
                  style={{ zIndex: 0 }}
                >
                  +{order.items.length - 4}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {order.items.map((i) => i.product.name).join(', ')}
              </p>
              <p className="text-xs text-muted-foreground">
                {order.items.length} item{order.items.length > 1 ? 's' : ''} • {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-semibold text-accent">{formatPrice(order.total)}</p>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>

          {/* Beli Lagi Button */}
          {!isActive && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <Button
                variant="outline"
                size="sm"
                className="w-full rounded-xl gap-2 bg-accent/5 border-accent/20 text-accent hover:bg-accent hover:text-accent-foreground"
                onClick={(e) => handleReorder(order, e)}
              >
                <RotateCcw className="h-4 w-4" />
                Beli Lagi
                <ShoppingCart className="h-4 w-4 ml-auto" />
              </Button>
            </div>
          )}
        </Link>
      </motion.div>
    );
  };

  return (
    <PageContainer title="My Orders" rightAction={historyButton}>
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="font-display font-bold text-lg mb-2">No Orders Yet</h2>
          <p className="text-muted-foreground mb-6">Start ordering your favorite coffee!</p>
          <Link
            to="/menu"
            className="px-6 py-3 bg-accent text-accent-foreground rounded-full font-semibold"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-6 pb-24">
          {activeOrders.length > 0 && (
            <section>
              <h2 className="font-display font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                Active Orders
              </h2>
              <div className="space-y-3">
                {activeOrders.map((order, index) => renderOrderCard(order, index, true))}
              </div>
            </section>
          )}

          {pastOrders.length > 0 && (
            <section>
              <h2 className="font-display font-semibold mb-3 text-muted-foreground">Past Orders</h2>
              <div className="space-y-3">
                {pastOrders.map((order, index) => renderOrderCard(order, index, false))}
              </div>
            </section>
          )}
        </div>
      )}

      <PWAInstallPrompt />
    </PageContainer>
  );
}
