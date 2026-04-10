import { MenuCard } from './MenuCard';
import { MenuGridSkeleton } from '@/components/skeleton/MenuSkeleton';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface MenuGridProps {
  products: Product[];
  selectedCategory: string | null;
  isLoading?: boolean;
}

// Random discounts for demo
const discounts: Record<string, number> = {
  'espresso': 25,
  'latte': 15,
  'croissant': 20,
};

export function MenuGrid({ products, selectedCategory, isLoading }: MenuGridProps) {
  const filteredProducts = selectedCategory 
    ? products.filter(p => p.category === selectedCategory)
    : products;

  if (isLoading) {
    return <MenuGridSkeleton count={6} />;
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {filteredProducts.slice(0, 6).map((product, index) => (
        <MenuCard 
          key={product.id} 
          product={product} 
          index={index}
          discount={discounts[product.id]}
        />
      ))}
    </div>
  );
}
