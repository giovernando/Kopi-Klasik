import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, PanInfo, Easing } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Promo {
  id: number;
  title: string;
  subtitle: string;
  image: string;
}

interface PromoCarouselProps {
  promos: Promo[];
  autoSlideInterval?: number;
}

export function PromoCarousel({ promos, autoSlideInterval = 4000 }: PromoCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    const autoSlide = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % promos.length);
    }, autoSlideInterval);

    return () => clearInterval(autoSlide);
  }, [promos.length, autoSlideInterval]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    
    if (info.offset.x < -swipeThreshold) {
      // Swipe left - next slide
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % promos.length);
    } else if (info.offset.x > swipeThreshold) {
      // Swipe right - previous slide
      setDirection(-1);
      setCurrentSlide((prev) => (prev - 1 + promos.length) % promos.length);
    }
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
  };

  return (
    <section className="relative">
      {/* Carousel Container */}
      <div className="relative h-48 rounded-3xl overflow-hidden shadow-lg">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'tween', ease: 'easeInOut', duration: 0.6 },
              opacity: { duration: 0.4 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            {/* Background Image */}
            <img
              src={promos[currentSlide].image}
              alt={promos[currentSlide].title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
            
            {/* Content with Stagger Animation */}
            <div className="relative z-10 h-full flex flex-col justify-center p-6">
              {/* Title */}
              <motion.h2
                key={`title-${currentSlide}`}
                custom={0}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-2xl md:text-3xl font-display font-bold text-white"
              >
                {promos[currentSlide].title}
              </motion.h2>
              
              {/* Subtitle */}
              <motion.p
                key={`subtitle-${currentSlide}`}
                custom={0.1}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-sm md:text-base text-white/85 mt-1"
              >
                {promos[currentSlide].subtitle}
              </motion.p>
              
              {/* CTA Button */}
              <motion.div
                key={`cta-${currentSlide}`}
                custom={0.2}
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                <Button 
                  variant="default" 
                  size="sm" 
                  className="mt-4 w-fit rounded-full bg-gradient-to-r from-accent to-caramel hover:shadow-lg hover:scale-105 transition-all duration-300"
                  asChild
                >
                  <Link to="/menu">Order Now</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Animated Indicator Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {promos.map((_, idx) => (
          <motion.button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={cn(
              'rounded-full transition-colors duration-300',
              idx === currentSlide 
                ? 'bg-accent' 
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            )}
            animate={{
              width: idx === currentSlide ? 24 : 8,
              height: 8,
              scale: idx === currentSlide ? 1.1 : 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </section>
  );
}
