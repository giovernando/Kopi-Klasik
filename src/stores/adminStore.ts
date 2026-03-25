import { create } from 'zustand';
import { Product, ProductCategory } from '@/types';
import { products as initialProducts } from '@/data/products';

export interface AdminOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: Date;
  deliveryMethod: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  ordersCount: number;
  totalSpent: number;
  createdAt: Date;
}

export interface StoreSettings {
  storeName: string;
  address: string;
  phone: string;
  email: string;
  openingHours: { day: string; hours: string }[];
}

export interface ContentSettings {
  heroTitle: string;
  heroSubtitle: string;
  specialOfferTitle: string;
  specialOfferDescription: string;
  galleryImages: string[];
}

interface AdminStore {
  products: Product[];
  orders: AdminOrder[];
  customers: AdminCustomer[];
  storeSettings: StoreSettings;
  contentSettings: ContentSettings;
  
  // Product actions
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Order actions
  updateOrderStatus: (id: string, status: AdminOrder['status']) => void;
  
  // Settings actions
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;
  updateContentSettings: (settings: Partial<ContentSettings>) => void;
}

// Mock data
const mockOrders: AdminOrder[] = [
  {
    id: 'ORD-001',
    customerName: 'John Doe',
    customerEmail: 'john@email.com',
    items: [
      { name: 'Cappuccino', quantity: 2, price: 35000 },
      { name: 'Croissant', quantity: 1, price: 28000 },
    ],
    total: 98000,
    status: 'pending',
    createdAt: new Date(),
    deliveryMethod: 'pickup',
  },
  {
    id: 'ORD-002',
    customerName: 'Jane Smith',
    customerEmail: 'jane@email.com',
    items: [
      { name: 'Latte', quantity: 1, price: 38000 },
      { name: 'Tiramisu', quantity: 1, price: 48000 },
    ],
    total: 86000,
    status: 'processing',
    createdAt: new Date(Date.now() - 3600000),
    deliveryMethod: 'grab',
  },
  {
    id: 'ORD-003',
    customerName: 'Bob Wilson',
    customerEmail: 'bob@email.com',
    items: [
      { name: 'Americano', quantity: 3, price: 28000 },
    ],
    total: 84000,
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000),
    deliveryMethod: 'gojek',
  },
];

const mockCustomers: AdminCustomer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@email.com',
    phone: '+62812345678',
    ordersCount: 12,
    totalSpent: 1250000,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@email.com',
    phone: '+62887654321',
    ordersCount: 8,
    totalSpent: 890000,
    createdAt: new Date('2024-02-20'),
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@email.com',
    ordersCount: 5,
    totalSpent: 420000,
    createdAt: new Date('2024-03-10'),
  },
];

export const useAdminStore = create<AdminStore>((set) => ({
  products: [...initialProducts],
  orders: mockOrders,
  customers: mockCustomers,
  storeSettings: {
    storeName: 'Kopi Klasik',
    address: 'Jl. Sudirman No. 123, Jakarta',
    phone: '+62 21 1234567',
    email: 'hello@kopiklasik.com',
    openingHours: [
      { day: 'Monday - Friday', hours: '07:00 - 22:00' },
      { day: 'Saturday', hours: '08:00 - 23:00' },
      { day: 'Sunday', hours: '08:00 - 21:00' },
    ],
  },
  contentSettings: {
    heroTitle: 'Start Your Day with Perfect Coffee',
    heroSubtitle: 'Premium beans, expertly crafted',
    specialOfferTitle: 'Buy 2 Get 1 Free',
    specialOfferDescription: 'On all espresso drinks this weekend',
    galleryImages: [],
  },

  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
    })),

  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  updateOrderStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, status } : o
      ),
    })),

  updateStoreSettings: (settings) =>
    set((state) => ({
      storeSettings: { ...state.storeSettings, ...settings },
    })),

  updateContentSettings: (settings) =>
    set((state) => ({
      contentSettings: { ...state.contentSettings, ...settings },
    })),
}));
