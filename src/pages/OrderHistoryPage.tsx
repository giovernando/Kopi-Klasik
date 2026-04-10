import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Clock, Check, ChevronRight, Coffee, Search, Filter, X, CalendarDays, RotateCcw, ShoppingCart } from 'lucide-react';
import { useOrderStore } from '@/stores/orderStore';
import { useCartStore } from '@/stores/cartStore';
import { PageContainer } from '@/components/layout/PageContainer';
import { Order, OrderStatus } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const statusConfig: Record<OrderStatus, { label: string; color: string; bgColor: string; icon: typeof Clock }> = {
  pending: { label: 'Pending', color: 'text-warning', bgColor: 'bg-warning/10', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'text-info', bgColor: 'bg-info/10', icon: Check },
  preparing: { label: 'Preparing', color: 'text-accent', bgColor: 'bg-accent/10', icon: Coffee },
  ready: { label: 'Ready', color: 'text-success', bgColor: 'bg-success/10', icon: Package },
  delivering: { label: 'On the Way', color: 'text-accent', bgColor: 'bg-accent/10', icon: Package },
  completed: { label: 'Completed', color: 'text-success', bgColor: 'bg-success/10', icon: Check },
  cancelled: { label: 'Cancelled', color: 'text-destructive', bgColor: 'bg-destructive/10', icon: Clock },
};

type FilterStatus = 'all' | OrderStatus;
type SortBy = 'newest' | 'oldest' | 'price_high' | 'price_low';

export default function OrderHistoryPage() {
  const orders = useOrderStore((s) => s.orders);
  const addItem = useCartStore((s) => s.addItem);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [showFilters, setShowFilters] = useState(false);

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
      toast.success(`${itemsAdded} item${itemsAdded > 1 ? 's' : ''} added to cart`, {
        description: 'Tap to view your cart',
        action: {
          label: 'View Cart',
          onClick: () => navigate('/cart'),
        },
      });
    } else {
      toast.error('No available items to add');
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order => 
        order.id.toLowerCase().includes(query) ||
        order.items.some(item => item.product.name.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'price_high':
        result.sort((a, b) => b.total - a.total);
        break;
      case 'price_low':
        result.sort((a, b) => a.total - b.total);
        break;
    }

    return result;
  }, [orders, searchQuery, statusFilter, sortBy]);

  const activeFiltersCount = (statusFilter !== 'all' ? 1 : 0) + (sortBy !== 'newest' ? 1 : 0);

  const clearFilters = () => {
    setStatusFilter('all');
    setSortBy('newest');
    setSearchQuery('');
  };

  return (
    <PageContainer title="Order History" showBack>
      {/* Search & Filter Bar */}
      <div className="space-y-3 mb-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders or menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 rounded-xl bg-card border-border/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={showFilters ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="rounded-full gap-2"
          >
            <Filter className="h-4 w-4" />
            Filter
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground"
            >
              Clear all
            </Button>
          )}
        </div>

        {/* Filter Options */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Status</label>
                  <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as FilterStatus)}>
                    <SelectTrigger className="rounded-xl bg-card">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border z-50">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="preparing">Preparing</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="delivering">Delivering</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Sort By</label>
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
                    <SelectTrigger className="rounded-xl bg-card">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border z-50">
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="price_high">Highest Price</SelectItem>
                      <SelectItem value="price_low">Lowest Price</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Order List */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="font-display font-bold text-lg mb-2">
            {orders.length === 0 ? 'No Orders Yet' : 'No Orders Found'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {orders.length === 0 
              ? 'Start ordering your favorite coffee!' 
              : 'Try adjusting your search or filters'}
          </p>
          {orders.length === 0 ? (
            <Link
              to="/menu"
              className="px-6 py-3 bg-accent text-accent-foreground rounded-full font-semibold"
            >
              Browse Menu
            </Link>
          ) : (
            <Button variant="outline" onClick={clearFilters} className="rounded-full">
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4 pb-24">
          {filteredOrders.map((order, index) => {
            const config = statusConfig[order.status];
            const StatusIcon = config.icon;
            const isActive = !['completed', 'cancelled'].includes(order.status);

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/orders/${order.id}`}
                  className={`block bg-card border rounded-2xl p-4 transition-all ${
                    isActive ? 'border-accent/30 shadow-sm' : 'border-border hover:border-accent/30'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold">{order.id}</span>
                      {isActive && (
                        <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                      )}
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color} ${config.bgColor}`}>
                      <StatusIcon className="h-3.5 w-3.5" />
                      <span>{config.label}</span>
                    </div>
                  </div>

                  {/* Product Images */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex -space-x-3">
                      {order.items.slice(0, 4).map((item, idx) => (
                        <div
                          key={item.id}
                          className="w-12 h-12 rounded-xl border-2 border-card overflow-hidden bg-muted"
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
                          className="w-12 h-12 rounded-xl border-2 border-card bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground"
                          style={{ zIndex: 0 }}
                        >
                          +{order.items.length - 4}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {order.items.map(i => i.product.name).join(', ')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.items.reduce((acc, i) => acc + i.quantity, 0)} item{order.items.reduce((acc, i) => acc + i.quantity, 0) > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5" />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-accent">{formatPrice(order.total)}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Reorder Button */}
                  <motion.div 
                    className="mt-3 pt-3 border-t border-border/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-xl gap-2 bg-accent/5 border-accent/20 text-accent hover:bg-accent hover:text-accent-foreground"
                      onClick={(e) => handleReorder(order, e)}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reorder
                      <ShoppingCart className="h-4 w-4 ml-auto" />
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
