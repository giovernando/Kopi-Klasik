import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, MapPin } from 'lucide-react';
import { products, categories } from '@/data/products';
import { TopNavbar } from '@/components/home/TopNavbar';
import { SearchBar } from '@/components/home/SearchBar';
import { HorizontalCategory } from '@/components/home/HorizontalCategory';
import { MenuGrid } from '@/components/home/MenuGrid';
import { HomeFooter } from '@/components/home/HomeFooter';
import { PromoCarousel } from '@/components/home/PromoCarousel';
import { PullToRefresh } from '@/components/home/PullToRefresh';
import { PWAInstallPrompt } from '@/components/home/PWAInstallPrompt';
import { HomePageSkeleton } from '@/components/skeleton/MenuSkeleton';

const promos = [
  {
    id: 1,
    title: 'Up to 35% offer',
    subtitle: 'Good Coffee Good Idea',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
  },
  {
    id: 2,
    title: 'Buy 2 Get 1 Free',
    subtitle: 'Weekend Special Deals',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
  },
  {
    id: 3,
    title: 'Free Delivery',
    subtitle: 'Min. Order Rp 50.000',
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80',
  },
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-orange-50/50 to-background pb-28">
      {/* Top Navbar */}
      <TopNavbar />

      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-40 bg-gradient-to-b from-orange-50 to-orange-50/95 backdrop-blur-md shadow-sm">
        <div className="px-4 py-3 space-y-2">
          <SearchBar />
          {/* Small Location Indicator */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-accent" />
            <span>Palembang</span>
          </div>
        </div>
      </div>

      {/* Pull to Refresh Content */}
      <PullToRefresh onRefresh={handleRefresh}>
        {/* Content */}
        <div className="px-4 space-y-5 pt-4">
          {isLoading ? (
            <HomePageSkeleton />
          ) : (
            <>
              {/* Promo Banner Carousel */}
              <PromoCarousel promos={promos} autoSlideInterval={4000} />

              {/* Horizontal Categories Section */}
              <section>
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-lg font-display font-semibold mb-3"
                >
                  Categories
                </motion.h2>
                <HorizontalCategory
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={handleCategorySelect}
                />
              </section>

              {/* Menu Grid Section */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-display font-semibold">
                    {selectedCategory 
                      ? categories.find(c => c.id === selectedCategory)?.name || 'Menu'
                      : 'Popular Items'}
                  </h2>
                  <Link to="/menu" className="text-sm text-accent font-medium flex items-center gap-1">
                    See all <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <MenuGrid 
                  products={products} 
                  selectedCategory={selectedCategory}
                />
              </section>
            </>
          )}
        </div>
      </PullToRefresh>

      {/* Footer */}
      <HomeFooter />

      {/* PWA Install Prompt */}
      <PWAInstallPrompt alwaysShow />
    </div>
  );
}
