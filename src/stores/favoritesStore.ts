import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

interface FavoritesStore {
  favorites: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: Product) => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (product) => {
        set((state) => ({
          favorites: [...state.favorites, product],
        }));
      },

      removeFavorite: (productId) => {
        set((state) => ({
          favorites: state.favorites.filter((p) => p.id !== productId),
        }));
      },

      isFavorite: (productId) => {
        return get().favorites.some((p) => p.id === productId);
      },

      toggleFavorite: (product) => {
        const { isFavorite, addFavorite, removeFavorite } = get();
        if (isFavorite(product.id)) {
          removeFavorite(product.id);
        } else {
          addFavorite(product);
        }
      },
    }),
    {
      name: 'favorites-storage',
    }
  )
);
