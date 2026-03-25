import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Star } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'horizontal';
}

export function ProductCard({ product, variant = 'grid' }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  if (variant === 'horizontal') {
    return (
      <Link to={`/product/${product.id}`}>
        <motion.div
          whileTap={{ scale: 0.98 }}
          className="bg-card border border-border rounded-2xl p-3 flex items-center gap-3 shadow-card hover:shadow-card-hover transition-shadow"
        >
          <div className="w-20 h-20 bg-secondary rounded-xl overflow-hidden flex-shrink-0">
            <div className="w-full h-full bg-gradient-to-br from-coffee-light/20 to-coffee-medium/20 flex items-center justify-center text-3xl">
              {product.category === 'coffee' ? '☕' : 
               product.category === 'tea' ? '🍵' :
               product.category === 'pastry' ? '🥐' :
               product.category === 'sandwich' ? '🥪' : '🍰'}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-caramel text-caramel" />
                <span className="text-xs font-medium">4.8</span>
              </div>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-sm font-semibold text-accent">{formatPrice(product.price)}</span>
            </div>
          </div>
          <Button
            variant="accent"
            size="iconSm"
            className="rounded-xl flex-shrink-0"
            onClick={handleQuickAdd}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link to={`/product/${product.id}`}>
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow"
      >
        <div className="aspect-square bg-secondary relative">
          <div className="absolute inset-0 bg-gradient-to-br from-coffee-light/20 to-coffee-medium/20 flex items-center justify-center text-5xl">
            {product.category === 'coffee' ? '☕' : 
             product.category === 'tea' ? '🍵' :
             product.category === 'pastry' ? '🥐' :
             product.category === 'sandwich' ? '🥪' : '🍰'}
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-foreground text-sm truncate">{product.name}</h3>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm font-bold text-accent">{formatPrice(product.price)}</span>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-caramel text-caramel" />
              <span className="text-xs text-muted-foreground">4.8</span>
            </div>
          </div>
          <button
            onClick={handleQuickAdd}
            className="mt-2 w-full py-2 bg-accent text-accent-foreground rounded-lg flex items-center justify-center gap-2 text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add to Cart
          </button>
        </div>
      </motion.div>
    </Link>
  );
}
