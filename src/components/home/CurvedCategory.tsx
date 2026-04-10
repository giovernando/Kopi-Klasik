import { motion } from 'framer-motion';
import { haptics } from '@/utils/haptics';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  icon: string;
  image?: string;
}

interface CurvedCategoryProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (id: string) => void;
}

export function CurvedCategory({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CurvedCategoryProps) {
  // Calculate arc positions using trigonometry
  const getArcPosition = (index: number, total: number) => {
    // Arc spans from -60 to 60 degrees (120 degree arc)
    const startAngle = -60;
    const endAngle = 60;
    const angleRange = endAngle - startAngle;
    const angle = startAngle + (index / (total - 1)) * angleRange;
    const radians = (angle * Math.PI) / 180;
    
    // Radius for the arc
    const radius = 140;
    
    // Calculate x and y positions (flip y for visual arc curving upward)
    const x = Math.sin(radians) * radius;
    const y = -Math.cos(radians) * radius + radius;
    
    return { x, y, angle };
  };

  const handleSelect = (id: string) => {
    haptics.selection();
    onSelectCategory(id);
  };

  return (
    <div className="relative w-full h-48 flex items-end justify-center overflow-hidden">
      {/* Arc container */}
      <div className="relative w-80 h-40">
        {categories.map((category, index) => {
          const { x, y } = getArcPosition(index, categories.length);
          const isActive = selectedCategory === category.id;
          const isCenter = index === Math.floor(categories.length / 2);
          
          return (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: isActive ? 1.15 : isCenter && !selectedCategory ? 1.1 : 1,
                x: x,
                y: y,
              }}
              transition={{ 
                delay: index * 0.08,
                type: 'spring',
                stiffness: 300,
                damping: 20
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(category.id)}
              className="absolute left-1/2 top-0 -translate-x-1/2 flex flex-col items-center gap-2"
              style={{ zIndex: isActive ? 10 : 1 }}
            >
              {/* Icon Container */}
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  boxShadow: isActive 
                    ? '0 8px 24px rgba(0, 0, 0, 0.15)' 
                    : '0 4px 12px rgba(0, 0, 0, 0.08)'
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={cn(
                  'w-14 h-14 rounded-full overflow-hidden flex items-center justify-center transition-colors duration-300',
                  isActive 
                    ? 'ring-2 ring-accent ring-offset-2' 
                    : 'bg-card text-foreground'
                )}
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
                'text-xs font-medium transition-all duration-300',
                isActive ? 'text-accent font-bold' : 'text-muted-foreground'
              )}>
                {category.name}
              </span>
              
              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="categoryIndicator"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute -bottom-1 w-6 h-1 bg-accent rounded-full"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}