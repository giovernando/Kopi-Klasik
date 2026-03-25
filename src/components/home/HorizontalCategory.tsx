import { motion } from 'framer-motion';
import { haptics } from '@/utils/haptics';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface Category {
  id: string;
  name: string;
  icon: string;
  image?: string;
}

interface HorizontalCategoryProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (id: string) => void;
}

export function HorizontalCategory({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: HorizontalCategoryProps) {
  const handleSelect = (id: string) => {
    haptics.selection();
    onSelectCategory(id);
  };

  return (
    <ScrollArea className="w-full">
      <div className="flex gap-3 pb-2">
        {categories.map((category, index) => {
          const isActive = selectedCategory === category.id;
          
          return (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(category.id)}
              className={cn(
                'flex flex-col items-center gap-2 px-4 py-3 rounded-2xl min-w-[72px] transition-all duration-300',
                isActive 
                  ? 'bg-accent shadow-md' 
                  : 'bg-card border border-border/50'
              )}
            >
              {/* Icon - Use image if available, fallback to emoji */}
              <motion.div
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center"
              >
                {category.image ? (
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">{category.icon}</span>
                )}
              </motion.div>
              
              {/* Label */}
              <span className={cn(
                'text-xs font-medium whitespace-nowrap transition-colors duration-300',
                isActive ? 'text-accent-foreground' : 'text-muted-foreground'
              )}>
                {category.name}
              </span>
            </motion.button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" className="invisible" />
    </ScrollArea>
  );
}