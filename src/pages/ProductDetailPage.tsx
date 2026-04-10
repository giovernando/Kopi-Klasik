import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Minus, Plus, Star, Heart, ShoppingBag, Check, Flame, Snowflake, Droplets } from 'lucide-react';
import { haptics } from '@/utils/haptics';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getProductById } from '@/data/products';
import { useCartStore } from '@/stores/cartStore';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { useLanguageStore } from '@/stores/languageStore';
import { useToast } from '@/hooks/use-toast';
import { ProductSize, ProductCustomization } from '@/types';
import { cn } from '@/lib/utils';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const addItem = useCartStore((state) => state.addItem);
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { t } = useLanguageStore();

  const product = getProductById(id || '');

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<ProductSize | undefined>(product?.sizes?.[0]);
  const [selectedCustomizations, setSelectedCustomizations] = useState<ProductCustomization[]>([]);
  const [notes, setNotes] = useState('');

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">{t('product.notFound')}</p>
      </div>
    );
  }

  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const calculateTotal = () => {
    let total = product.price;
    if (selectedSize) total += selectedSize.priceModifier;
    total += selectedCustomizations.reduce((sum, c) => sum + c.price, 0);
    return total * quantity;
  };

  const toggleCustomization = (customization: ProductCustomization) => {
    haptics.selection();
    setSelectedCustomizations((prev) => {
      const exists = prev.find((c) => c.id === customization.id);
      return exists ? prev.filter((c) => c.id !== customization.id) : [...prev, customization];
    });
  };

  const handleAddToCart = () => {
    haptics.success();
    addItem(product, quantity, selectedSize, selectedCustomizations, notes);
    toast({ title: t('product.addedToCart'), description: `${quantity}x ${product.name}` });
    navigate('/cart');
  };

  const productTags = product.category === 'coffee'
    ? [{ icon: <Flame className="h-3 w-3" />, label: 'Hot' }, { icon: <Snowflake className="h-3 w-3" />, label: 'Iced' }, { icon: <Droplets className="h-3 w-3" />, label: 'Milk-based' }]
    : product.category === 'tea'
    ? [{ icon: <Flame className="h-3 w-3" />, label: 'Hot' }, { icon: <Snowflake className="h-3 w-3" />, label: 'Iced' }]
    : [];

  const ratingBreakdown = [{ stars: 5, percentage: 70 }, { stars: 4, percentage: 20 }, { stars: 3, percentage: 7 }, { stars: 2, percentage: 2 }, { stars: 1, percentage: 1 }];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background pb-44">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative h-72 bg-secondary overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between safe-top">
          <Button variant="secondary" size="icon" className="rounded-full bg-background/80 backdrop-blur-sm h-10 w-10" onClick={() => navigate(-1)}><ChevronLeft className="h-5 w-5" /></Button>
          <Button variant="secondary" size="icon" className={cn('rounded-full backdrop-blur-sm h-10 w-10', isFavorite(product.id) ? 'bg-destructive/20 text-destructive' : 'bg-background/80')} onClick={() => { haptics.medium(); toggleFavorite(product); }}>
            <Heart className={cn('h-5 w-5', isFavorite(product.id) && 'fill-current')} />
          </Button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="px-4 -mt-6 relative">
        <div className="bg-card rounded-t-3xl p-5 shadow-card">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-display font-bold">{product.name}</h1>
              <p className="text-muted-foreground mt-1">{product.description}</p>
              {productTags.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {productTags.map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-secondary rounded-full text-xs font-medium text-secondary-foreground">{tag.icon}{tag.label}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 bg-secondary px-3 py-1.5 rounded-xl"><Star className="h-4 w-4 fill-gold text-gold" /><span className="font-bold text-sm">4.8</span></div>
          </div>

          <div className="mt-4 p-3 bg-secondary/50 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">4.8</p>
                <div className="flex items-center gap-0.5 justify-center mt-1">
                  {[1, 2, 3, 4, 5].map((i) => (<Star key={i} className={cn('h-3 w-3', i <= 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-yellow-400/50 text-yellow-400/50')} />))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">250+ {t('product.reviews')}</p>
              </div>
              <div className="flex-1 space-y-1">
                {ratingBreakdown.map((item) => (
                  <div key={item.stars} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-3">{item.stars}</span>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-yellow-400 rounded-full" style={{ width: `${item.percentage}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {product.sizes && product.sizes.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6">
              <h3 className="font-semibold mb-3">{t('product.size')}</h3>
              <div className="flex gap-3">
                {product.sizes.map((size) => (
                  <button key={size.id} onClick={() => { haptics.selection(); setSelectedSize(size); }} className={cn('flex-1 py-3 px-4 rounded-xl border-2 transition-all duration-200 active:scale-95', selectedSize?.id === size.id ? 'border-accent bg-accent/15 shadow-md' : 'border-border hover:border-muted-foreground/30')}>
                    <p className={cn('font-semibold', selectedSize?.id === size.id && 'text-accent')}>{size.name}</p>
                    {size.priceModifier > 0 && <p className="text-xs text-muted-foreground mt-0.5">+{formatPrice(size.priceModifier)}</p>}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {product.customizations && product.customizations.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6">
              <h3 className="font-semibold mb-3">{t('product.addons')}</h3>
              <div className="space-y-2">
                {product.customizations.map((custom) => {
                  const isSelected = selectedCustomizations.some((c) => c.id === custom.id);
                  return (
                    <button key={custom.id} onClick={() => toggleCustomization(custom)} className={cn('w-full flex items-center justify-between py-3 px-4 rounded-xl border-2 transition-all duration-200 active:scale-[0.98]', isSelected ? 'border-accent bg-accent/15 shadow-md' : 'border-border hover:border-muted-foreground/30')}>
                      <div className="flex items-center gap-3">
                        <div className={cn('w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all', isSelected ? 'bg-accent border-accent' : 'border-muted-foreground/40')}>
                          {isSelected && <Check className="h-3 w-3 text-accent-foreground" />}
                        </div>
                        <span className={cn('font-medium', isSelected && 'text-accent')}>{custom.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">+{formatPrice(custom.price)}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6">
            <h3 className="font-semibold mb-3">{t('product.specialInstructions')}</h3>
            <Textarea placeholder={t('product.specialPlaceholder')} value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-[80px] resize-none bg-secondary border-0" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-6 flex items-center justify-between">
            <h3 className="font-semibold">{t('product.quantity')}</h3>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="rounded-full h-12 w-12 active:scale-90 transition-transform shadow-sm" onClick={() => { haptics.light(); setQuantity(Math.max(1, quantity - 1)); }} disabled={quantity <= 1}><Minus className="h-5 w-5" /></Button>
              <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
              <Button variant="outline" size="icon" className="rounded-full h-12 w-12 active:scale-90 transition-transform shadow-sm" onClick={() => { haptics.light(); setQuantity(Math.min(10, quantity + 1)); }} disabled={quantity >= 10}><Plus className="h-5 w-5" /></Button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div initial={{ y: 100 }} animate={{ y: 0 }} transition={{ type: 'spring', damping: 25 }} className="fixed bottom-[72px] left-0 right-0 max-w-md mx-auto bg-card/95 backdrop-blur-lg border-t border-border px-4 py-4 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.15)]">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-0.5">{t('product.total')}</p>
            <motion.p key={calculateTotal()} initial={{ scale: 1.15, color: 'hsl(var(--accent))' }} animate={{ scale: 1, color: 'hsl(var(--accent))' }} transition={{ type: 'spring', damping: 15 }} className="text-2xl font-bold">
              {formatPrice(calculateTotal())}
            </motion.p>
          </div>
          <Button variant="accent" size="lg" onClick={handleAddToCart} className="flex-1 h-14 text-base font-semibold rounded-2xl active:scale-95 transition-all shadow-lg hover:shadow-xl">
            <ShoppingBag className="h-5 w-5 mr-2" />{t('product.addToCart')}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
