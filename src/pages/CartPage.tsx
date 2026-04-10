import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { useLanguageStore } from '@/stores/languageStore';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const { t } = useLanguageStore();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const getItemPrice = (item: typeof items[0]) => {
    let price = item.product.price;
    if (item.size) price += item.size.priceModifier;
    if (item.customizations) price += item.customizations.reduce((s, c) => s + c.price, 0);
    return price;
  };

  if (items.length === 0) {
    return (
      <PageContainer title={t('cart.title')}>
        <div className="flex flex-col items-center justify-center py-20">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-display font-semibold mb-2">{t('cart.empty')}</h2>
          <p className="text-muted-foreground mb-6">{t('cart.emptyDesc')}</p>
          <Button variant="accent" asChild><Link to="/menu">{t('cart.browseMenu')}</Link></Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={t('cart.title')}>
      <AnimatePresence>
        <div className="space-y-3 pb-32">
          {items.map((item) => (
            <motion.div key={item.id} layout exit={{ opacity: 0, x: -100 }} className="bg-card border border-border rounded-2xl p-4 shadow-card">
              <div className="flex gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{item.product.name}</h3>
                  {item.size && <p className="text-xs text-muted-foreground">{item.size.name}</p>}
                  {item.customizations && item.customizations.length > 0 && (
                    <p className="text-xs text-muted-foreground">{item.customizations.map(c => c.name).join(', ')}</p>
                  )}
                  <p className="text-sm font-semibold text-accent mt-1">{formatPrice(getItemPrice(item))}</p>
                </div>
                <Button variant="ghost" size="iconSm" onClick={() => removeItem(item.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
              </div>
              <div className="flex items-center justify-end gap-3 mt-3 pt-3 border-t border-border">
                <Button variant="outline" size="iconSm" className="rounded-full h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                <span className="font-semibold w-6 text-center">{item.quantity}</span>
                <Button variant="outline" size="iconSm" className="rounded-full h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      <div className="fixed bottom-20 left-0 right-0 bg-card border-t border-border p-4 safe-bottom">
        <div className="flex items-center justify-between mb-3">
          <span className="text-muted-foreground">{t('cart.subtotal')}</span>
          <span className="text-xl font-bold">{formatPrice(getSubtotal())}</span>
        </div>
        <Button variant="accent" size="lg" className="w-full" asChild><Link to="/checkout">{t('cart.checkout')}</Link></Button>
      </div>
    </PageContainer>
  );
}
