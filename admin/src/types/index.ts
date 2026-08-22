export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'EDITOR';

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: Role;
  avatar?: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'READY' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'CLICK' | 'PAYME' | 'CASH';

export interface OrderItem {
  id: string;
  productName: string;
  variant: string;
  quantity: number;
  priceMinor: number;
  totalMinor: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: OrderItem[];
  totalMinor: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
}

export interface Product {
  id: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  slug: string;
  category: string;
  fatContent?: string;
  volumeWeight?: string;
  shelfLife?: string;
  storageTemp?: string;
  priceMinor: number;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  image: string;
}

export interface Category {
  id: string;
  slug: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  description?: string;
  productCount: number;
  isActive: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'active' | 'inactive';
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  subject: string;
  message: string;
  status: 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED';
  createdAt: string;
}

export interface BlogPost {
  id: string;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  slug: string;
  category: string;
  readTime: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt: string;
}

export interface Certificate {
  id: string;
  titleUz: string;
  issuer: string;
  standard: string;
  year: number;
  isValid: boolean;
  fileUrl?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  ip: string;
  target: string;
  timestamp: string;
}
