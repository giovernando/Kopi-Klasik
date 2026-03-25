import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/stores/cartStore';
import { useToast } from '@/hooks/use-toast';
import { haptics } from '@/utils/haptics';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface MenuCardProps {
  product: Product;
  index: number;
  discount?: number;
}

export function MenuCard({ product, index, discount }: MenuCardProps) {
  const { toast } = useToast();
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  
  const cartItem = cartItems.find(item => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    haptics.success();
    addItem(product as any, 1);
    toast({
      title: 'Added to cart',
      description: `${product.name} added`,
    });
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    haptics.light();
    if (cartItem) {
      updateQuantity(cartItem.id, quantity + 1);
    }
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    haptics.light();
    if (cartItem) {
      if (quantity <= 1) {
        removeItem(cartItem.id);
      } else {
        updateQuantity(cartItem.id, quantity - 1);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.08,
        duration: 0.4,
        ease: 'easeOut'
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link to={`/product/${product.id}`}>
        <div className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50">
          {/* Product Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80';
              }}
            />
            
            {/* Discount Badge */}
            {discount && (
              <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-full">
                -{discount}%
              </div>
            )}

            {/* Floating Add/Quantity Button */}
            <div className="absolute bottom-2 right-2">
              {quantity === 0 ? (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleAdd}
                  className="w-10 h-10 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full flex items-center justify-center shadow-lg transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </motion.button>
              ) : (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1 bg-accent rounded-full px-1 py-1 shadow-lg"
                >
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleDecrease}
                    className="w-7 h-7 bg-accent-foreground/20 text-accent-foreground rounded-full flex items-center justify-center"
                  >
                    <Minus className="h-4 w-4" />
                  </motion.button>
                  <span className="text-accent-foreground font-bold text-sm min-w-[20px] text-center">
                    {quantity}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleIncrease}
                    className="w-7 h-7 bg-accent-foreground/20 text-accent-foreground rounded-full flex items-center justify-center"
                  >
                    <Plus className="h-4 w-4" />
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="p-3">
            <h3 className="font-semibold text-foreground text-sm truncate">
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              {product.description}
            </p>
            <p className="text-sm font-bold text-accent mt-2">
              {formatPrice(product.price)}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
