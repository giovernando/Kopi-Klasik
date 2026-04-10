import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Review {
  id: string;
  orderId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

interface ReviewStore {
  reviews: Review[];
  addReview: (orderId: string, rating: number, comment: string) => void;
  getReviewByOrderId: (orderId: string) => Review | undefined;
  hasReviewedOrder: (orderId: string) => boolean;
}

export const useReviewStore = create<ReviewStore>()(
  persist(
    (set, get) => ({
      reviews: [],

      addReview: (orderId, rating, comment) => {
        const newReview: Review = {
          id: `REV-${Date.now()}`,
          orderId,
          rating,
          comment,
          createdAt: new Date(),
        };

        set((state) => ({
          reviews: [...state.reviews, newReview],
        }));
      },

      getReviewByOrderId: (orderId) => {
        return get().reviews.find((r) => r.orderId === orderId);
      },

      hasReviewedOrder: (orderId) => {
        return get().reviews.some((r) => r.orderId === orderId);
      },
    }),
    {
      name: 'review-storage',
    }
  )
);
