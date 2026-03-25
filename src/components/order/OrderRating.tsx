import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useReviewStore } from '@/stores/reviewStore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface OrderRatingProps {
  orderId: string;
  onComplete?: () => void;
}

export function OrderRating({ orderId, onComplete }: OrderRatingProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addReview = useReviewStore((s) => s.addReview);
  const hasReviewed = useReviewStore((s) => s.hasReviewedOrder(orderId));
  const existingReview = useReviewStore((s) => s.getReviewByOrderId(orderId));
  const { toast } = useToast();

  if (hasReviewed && existingReview) {
    return (
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-display font-semibold mb-3">Your Review</h3>
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                'h-5 w-5',
                star <= existingReview.rating
                  ? 'fill-caramel text-caramel'
                  : 'text-muted-foreground'
              )}
            />
          ))}
        </div>
        {existingReview.comment && (
          <p className="text-muted-foreground text-sm">{existingReview.comment}</p>
        )}
      </div>
    );
  }

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: 'Please select a rating',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    addReview(orderId, rating, comment);
    
    toast({
      title: 'Thank you for your review!',
      description: 'Your feedback helps us improve.',
    });

    setIsSubmitting(false);
    onComplete?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-5"
    >
      <h3 className="font-display font-semibold mb-3">Rate Your Order</h3>
      
      {/* Star Rating */}
      <div className="flex items-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="focus:outline-none"
          >
            <Star
              className={cn(
                'h-8 w-8 transition-colors',
                (hoverRating || rating) >= star
                  ? 'fill-caramel text-caramel'
                  : 'text-muted-foreground'
              )}
            />
          </motion.button>
        ))}
      </div>

      {/* Comment */}
      <Textarea
        placeholder="Share your experience (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-[80px] resize-none mb-4"
      />

      {/* Submit Button */}
      <Button
        variant="accent"
        className="w-full"
        onClick={handleSubmit}
        disabled={isSubmitting || rating === 0}
      >
        {isSubmitting ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="h-5 w-5 border-2 border-accent-foreground border-t-transparent rounded-full"
          />
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Submit Review
          </>
        )}
      </Button>
    </motion.div>
  );
}
