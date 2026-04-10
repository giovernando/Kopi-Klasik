// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
  isAvailable: boolean;
  sizes?: ProductSize[];
  customizations?: ProductCustomization[];
}

export type ProductCategory = 'coffee' | 'tea' | 'pastry' | 'sandwich' | 'dessert';

export interface ProductSize {
  id: string;
  name: string;
  priceModifier: number;
}

export interface ProductCustomization {
  id: string;
  name: string;
  price: number;
}

// Cart types
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size?: ProductSize;
  customizations?: ProductCustomization[];
  notes?: string;
}

// Order types
export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  deliveryMethod: DeliveryMethod;
  deliveryAddress?: Address;
  tableNumber?: string;
  customerName?: string;
  pickupTime?: string;
  createdAt: Date;
  estimatedDelivery?: Date;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivering'
  | 'completed'
  | 'cancelled';

// Payment types
export type PaymentMethod = 'ewallet' | 'bank_transfer' | 'cash';

export interface PaymentDetails {
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
}

export type PaymentStatus = 'pending' | 'processing' | 'success' | 'failed';

// Delivery types
export type DeliveryMethod = 'dine_in' | 'pickup' | 'delivery';

export interface Address {
  id?: string;
  label: string;
  fullAddress: string;
  details?: string;
  lat?: number;
  lng?: number;
}

// Reservation types
export interface Reservation {
  id: string;
  date: Date;
  time: string;
  guests: number;
  name: string;
  phone: string;
  notes?: string;
  status: ReservationStatus;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  addresses?: Address[];
}

export type UserRole = 'customer' | 'admin';

// Auth types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
