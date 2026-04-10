import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, ShoppingBag } from 'lucide-react';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLanguageStore } from '@/stores/languageStore';

export default function FavoritesPage() {
  const favorites = useFavoritesStore((s) => s.favorites);
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite);
  const addItem = useCartStore((s) => s.addItem);
  const { toast } = useToast();
  const { t } = useLanguageStore();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const handleAddToCart = (product: typeof favorites[0]) => {
    addItem(product, 1);
    toast({ title: t('favorites.addedToCart'), description: `${product.name} ${t('favorites.addedToCartDesc')}` });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-4 px-4 h-14">
          <Link to="/profile" className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-display font-bold text-lg">{t('favorites.title')}</h1>
        </div>
      </header>

      <main className="p-4 pb-24">
        {favorites.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-display font-bold mb-2">{t('favorites.empty')}</h2>
            <p className="text-muted-foreground mb-6">{t('favorites.emptyDesc')}</p>
            <Button variant="accent" asChild><Link to="/menu">{t('cart.browseMenu')}</Link></Button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {favorites.map((product, index) => (
              <motion.div key={product.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4">
                <Link to={`/product/${product.id}`} className="flex-shrink-0">
                  <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center text-2xl">
                    {product.category === 'coffee' ? '☕' : product.category === 'tea' ? '🍵' : product.category === 'pastry' ? '🥐' : product.category === 'sandwich' ? '🥪' : '🍰'}
                  </div>
                </Link>
                <Link to={`/product/${product.id}`} className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                  <p className="text-accent font-semibold mt-1">{formatPrice(product.price)}</p>
                </Link>
                <div className="flex flex-col gap-2">
                  <Button variant="accent" size="iconSm" onClick={() => handleAddToCart(product)}><ShoppingBag className="h-4 w-4" /></Button>
                  <Button variant="outline" size="iconSm" onClick={() => removeFavorite(product.id)}><Heart className="h-4 w-4 fill-destructive text-destructive" /></Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
