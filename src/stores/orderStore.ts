import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, PaymentMethod, DeliveryMethod, Address, OrderStatus } from '@/types';
import { useCartStore } from './cartStore';

interface OrderStore {
  currentOrder: Partial<Order> | null;
  orders: Order[];
  paymentMethod: PaymentMethod | null;
  deliveryMethod: DeliveryMethod | null;
  deliveryAddress: Address | null;
  deliveryFee: number;
  
  setPaymentMethod: (method: PaymentMethod) => void;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  setDeliveryAddress: (address: Address) => void;
  createOrder: () => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getDeliveryFee: () => number;
  resetCheckout: () => void;
}

const DELIVERY_FEES: Record<DeliveryMethod, number> = {
  pickup: 0,
  grab: 15000,
  gojek: 12000,
};

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      currentOrder: null,
      orders: [],
      paymentMethod: null,
      deliveryMethod: null,
      deliveryAddress: null,
      deliveryFee: 0,

      setPaymentMethod: (method) => {
        set({ paymentMethod: method });
      },

      setDeliveryMethod: (method) => {
        const fee = DELIVERY_FEES[method];
        set({ deliveryMethod: method, deliveryFee: fee });
      },

      setDeliveryAddress: (address) => {
        set({ deliveryAddress: address });
      },

      createOrder: () => {
        const cartStore = useCartStore.getState();
        const { paymentMethod, deliveryMethod, deliveryAddress, deliveryFee } = get();

        const subtotal = cartStore.getSubtotal();
        const total = subtotal + deliveryFee;

        const newOrder: Order = {
          id: `ORD-${Date.now()}`,
          items: [...cartStore.items],
          subtotal,
          deliveryFee,
          total,
          status: 'pending',
          paymentMethod: paymentMethod || 'cash',
          deliveryMethod: deliveryMethod || 'pickup',
          deliveryAddress: deliveryAddress || undefined,
          createdAt: new Date(),
          estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000), // 30 mins
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
          currentOrder: newOrder,
        }));

        // Clear cart after order
        cartStore.clearCart();

        return newOrder;
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          ),
        }));
      },

      getDeliveryFee: () => {
        return get().deliveryFee;
      },

      resetCheckout: () => {
        set({
          paymentMethod: null,
          deliveryMethod: null,
          deliveryAddress: null,
          deliveryFee: 0,
        });
      },
    }),
    {
      name: 'order-storage',
      partialize: (state) => ({
        orders: state.orders,
      }),
    }
  )
);
