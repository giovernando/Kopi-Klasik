import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, ProductSize, ProductCustomization } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (
    product: Product,
    quantity?: number,
    size?: ProductSize,
    customizations?: ProductCustomization[],
    notes?: string
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateNotes: (itemId: string, notes: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, size, customizations, notes) => {
        const items = get().items;
        
        // Generate unique ID based on product + size + customizations
        const itemId = `${product.id}-${size?.id || 'default'}-${
          customizations?.map((c) => c.id).join('-') || 'none'
        }`;

        const existingItem = items.find((item) => item.id === itemId);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === itemId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          const newItem: CartItem = {
            id: itemId,
            product,
            quantity,
            size,
            customizations,
            notes,
          };
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (itemId) => {
        set({ items: get().items.filter((item) => item.id !== itemId) });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        });
      },

      updateNotes: (itemId, notes) => {
        set({
          items: get().items.map((item) =>
            item.id === itemId ? { ...item, notes } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          let itemPrice = item.product.price;
          
          if (item.size) {
            itemPrice += item.size.priceModifier;
          }
          
          if (item.customizations) {
            itemPrice += item.customizations.reduce((sum, c) => sum + c.price, 0);
          }
          
          return total + itemPrice * item.quantity;
        }, 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
