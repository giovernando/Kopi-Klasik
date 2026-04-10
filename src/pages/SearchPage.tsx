import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Search, X, Clock, TrendingUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { products, categories } from '@/data/products';
import { useLanguageStore } from '@/stores/languageStore';
import { haptics } from '@/utils/haptics';
import { cn } from '@/lib/utils';

const POPULAR_SEARCHES = ['Cappuccino', 'Latte', 'Matcha', 'Croissant', 'Cold Brew'];
const STORAGE_KEY = 'recent-searches';
const MAX_RECENT_SEARCHES = 5;

export default function SearchPage() {
  const navigate = useNavigate();
  const { t } = useLanguageStore();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setRecentSearches(JSON.parse(stored));
  }, []);

  const saveRecentSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter(s => s.toLowerCase() !== term.toLowerCase())].slice(0, MAX_RECENT_SEARCHES);
    setRecentSearches(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const clearRecentSearches = () => { haptics.light(); setRecentSearches([]); localStorage.removeItem(STORAGE_KEY); };

  const removeRecentSearch = (term: string) => {
    haptics.light();
    const updated = recentSearches.filter(s => s !== term);
    setRecentSearches(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(lowerQuery) || p.description.toLowerCase().includes(lowerQuery) || p.category.toLowerCase().includes(lowerQuery));
  }, [query]);

  const suggestions = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    const lowerQuery = query.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(lowerQuery)).map(p => p.name).slice(0, 5);
  }, [query]);

  const handleSearch = (term: string) => { haptics.selection(); setQuery(term); saveRecentSearch(term); };

  const handleProductClick = (productId: string) => {
    haptics.medium();
    if (query.trim()) saveRecentSearch(query.trim());
    navigate(`/product/${productId}`);
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 bg-background z-10 px-4 pt-4 pb-3 safe-top border-b border-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-full shrink-0" onClick={() => { haptics.light(); navigate(-1); }}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input autoFocus placeholder={t('search.placeholder')} value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setIsFocused(true)} className="pl-10 pr-10 bg-secondary border-0 rounded-xl" />
            {query && (
              <button onClick={() => { haptics.light(); setQuery(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">
        <AnimatePresence>
          {suggestions.length > 0 && query.length >= 2 && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-4">
              <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
                {suggestions.map((suggestion, idx) => (
                  <button key={suggestion} onClick={() => handleSearch(suggestion)} className={cn("w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary transition-colors", idx !== suggestions.length - 1 && "border-b border-border")}>
                    <Search className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{suggestion}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {query.trim() && filteredProducts.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-sm text-muted-foreground mb-3">{filteredProducts.length} {t('search.results')}</p>
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((product, index) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} onClick={() => handleProductClick(product.id)} className="bg-card rounded-2xl p-3 shadow-card cursor-pointer active:scale-95 transition-transform">
                  <div className="aspect-square rounded-xl overflow-hidden bg-secondary mb-2"><img src={product.image} alt={product.name} className="w-full h-full object-cover" /></div>
                  <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
                  <div className="flex items-center gap-1 mt-1"><Star className="h-3 w-3 fill-caramel text-caramel" /><span className="text-xs text-muted-foreground">4.5 • 250+</span></div>
                  <p className="text-sm font-bold text-accent mt-1">{formatPrice(product.price)}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {query.trim() && filteredProducts.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4"><Search className="h-8 w-8 text-muted-foreground" /></div>
            <h3 className="font-semibold text-lg">{t('search.noResults')}</h3>
            <p className="text-muted-foreground text-sm mt-1 text-center">{t('search.noResultsDesc')} "{query}".<br />{t('search.tryDifferent')}</p>
          </motion.div>
        )}

        {!query.trim() && (
          <>
            {recentSearches.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">{t('search.recent')}</h3>
                  <button onClick={clearRecentSearches} className="text-xs text-accent">{t('search.clearAll')}</button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((term) => (
                    <div key={term} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-secondary transition-colors">
                      <button onClick={() => handleSearch(term)} className="flex items-center gap-3 flex-1 text-left"><Clock className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{term}</span></button>
                      <button onClick={() => removeRecentSearch(term)} className="p-1 rounded-full hover:bg-muted"><X className="h-4 w-4 text-muted-foreground" /></button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex items-center gap-2 mb-3"><TrendingUp className="h-4 w-4 text-accent" /><h3 className="font-semibold text-sm">{t('search.popular')}</h3></div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button key={term} onClick={() => handleSearch(term)} className="px-4 py-2 bg-secondary rounded-full text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors active:scale-95">{term}</button>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8">
              <h3 className="font-semibold text-sm mb-3">{t('search.browseCategories')}</h3>
              <div className="grid grid-cols-4 gap-3">
                {categories.slice(0, 4).map((cat) => (
                  <button key={cat.id} onClick={() => { haptics.selection(); setQuery(cat.name); }} className="flex flex-col items-center p-3 bg-secondary rounded-xl hover:bg-accent/10 transition-colors active:scale-95">
                    <div className="w-10 h-10 rounded-full overflow-hidden mb-1"><img src={cat.image} alt={cat.name} className="w-full h-full object-cover" /></div>
                    <span className="text-xs font-medium">{cat.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}
