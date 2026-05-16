export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  status: 'active' | 'inactive';
  isFeatured: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  description: string; // e.g., "Home", "Office"
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  addresses: Address[];
  createdAt: any;
  updatedAt: any;
}

export interface CakeCustomization {
  size: string;
  flavor: string;
  frosting: string;
  decorations: string[];
  message?: string;
  basePrice: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  customization?: CakeCustomization;
}

export interface Order {
  id: string;
  userId?: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: any;
  updatedAt: any;
}
