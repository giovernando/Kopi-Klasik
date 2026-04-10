import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Plus, Minus, Heart, X, Coffee } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { products, categories } from '@/data/products';
import { ProductCategory } from '@/types';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/stores/cartStore';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { useToast } from '@/hooks/use-toast';
import { haptics } from '@/utils/haptics';
import { PWAInstallPrompt } from '@/components/home/PWAInstallPrompt';

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  
  const categoryParam = searchParams.get('category') as ProductCategory | null;
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>(
    categoryParam || 'all'
  );

  // Simulate loading for skeleton effect
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  const handleCategoryChange = (category: ProductCategory | 'all') => {
    haptics.selection();
    setSelectedCategory(category);
    if (category === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Add badges to products
  const productBadges: Record<string, string> = {
    '1': 'Best Seller',
    '2': 'Popular',
    '5': 'Best Seller',
    '7': 'Popular',
  };

  const handleQuickAdd = (e: React.MouseEvent, product: typeof products[0]) => {
    e.preventDefault();
    e.stopPropagation();
    haptics.success();
    addItem(product, 1);
    toast({
      title: 'Added to cart',
      description: `${product.name} added to your cart`,
    });
  };

  const handleIncrease = (e: React.MouseEvent, product: typeof products[0]) => {
    e.preventDefault();
    e.stopPropagation();
    haptics.light();
    const cartItem = cartItems.find(item => item.product.id === product.id);
    if (cartItem) updateQuantity(cartItem.id, cartItem.quantity + 1);
  };

  const handleDecrease = (e: React.MouseEvent, product: typeof products[0]) => {
    e.preventDefault();
    e.stopPropagation();
    haptics.light();
    const cartItem = cartItems.find(item => item.product.id === product.id);
    if (cartItem) {
      if (cartItem.quantity <= 1) removeItem(cartItem.id);
      else updateQuantity(cartItem.id, cartItem.quantity - 1);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent, product: typeof products[0]) => {
    e.preventDefault();
    e.stopPropagation();
    haptics.medium();
    toggleFavorite(product);
    toast({
      title: isFavorite(product.id) ? 'Removed from favorites' : 'Added to favorites',
      description: product.name,
    });
  };

  return (
    <PageContainer title="Menu">
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search menu, category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 pr-10 bg-secondary border-0"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Sticky Category Filter */}
      <div className="sticky top-0 z-40 bg-background -mx-4 px-4 py-2 mb-4 border-b border-border">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => handleCategoryChange('all')}
            className={cn(
              'px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 active:scale-95',
              selectedCategory === 'all'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={cn(
                'pl-2.5 pr-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 active:scale-95',
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              <img src={category.image} alt={category.name} className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid with Skeleton Loading */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border">
                <Skeleton className="aspect-square w-full" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <motion.div
            key={selectedCategory + searchQuery}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-2 gap-3"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/product/${product.id}`}>
                  <div className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all border border-border group">
                    {/* Product Image */}
                    <div className="aspect-square bg-muted relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80';
                        }}
                      />
                      
                      {/* Badge */}
                      {productBadges[product.id] && (
                        <div className="absolute top-2 left-2 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-1 rounded-full">
                          {productBadges[product.id]}
                        </div>
                      )}

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => handleToggleFavorite(e, product)}
                        className={cn(
                          'absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all',
                          isFavorite(product.id)
                            ? 'bg-destructive/20 text-destructive'
                            : 'bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-destructive'
                        )}
                      >
                        <Heart className={cn('h-4 w-4', isFavorite(product.id) && 'fill-current')} />
                      </button>

                      {/* Quick Add / Quantity Button */}
                      <div className="absolute bottom-2 right-2">
                        {(() => {
                          const cartItem = cartItems.find(item => item.product.id === product.id);
                          const qty = cartItem?.quantity || 0;
                          return qty === 0 ? (
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => handleQuickAdd(e, product)}
                              className="w-9 h-9 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full flex items-center justify-center shadow-lg transition-all"
                            >
                              <Plus className="h-5 w-5" />
                            </motion.button>
                          ) : (
                            <motion.div
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              className="flex items-center gap-0.5 bg-accent rounded-full px-1 py-1 shadow-lg"
                            >
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => handleDecrease(e, product)}
                                className="w-7 h-7 bg-accent-foreground/20 text-accent-foreground rounded-full flex items-center justify-center"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </motion.button>
                              <span className="text-accent-foreground font-bold text-xs min-w-[18px] text-center">
                                {qty}
                              </span>
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => handleIncrease(e, product)}
                                className="w-7 h-7 bg-accent-foreground/20 text-accent-foreground rounded-full flex items-center justify-center"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </motion.button>
                            </motion.div>
                          );
                        })()}
                      </div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-3">
                      <h3 className="font-semibold text-foreground text-sm truncate">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-semibold text-foreground">4.5</span>
                        <span className="text-[10px] text-muted-foreground">• 250+</span>
                      </div>
                      <p className="text-sm font-bold text-accent mt-2">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto bg-secondary rounded-full flex items-center justify-center mb-4">
              <Coffee className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Menu not found</h3>
            <p className="text-muted-foreground text-sm">
              Try searching with different keywords
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </PageContainer>
  );
}
