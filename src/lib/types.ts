import type { Locale } from "@/lib/i18n/locales";

export interface LocalizedString {
  uz: string;
  ru: string;
  en: string;
}

export function localize(value: LocalizedString, locale: Locale): string {
  return value[locale];
}

export const productCategories = [
  "milk",
  "kefir",
  "yogurt",
  "sour-cream",
  "cream",
  "butter",
  "other",
] as const;

export type ProductCategory = (typeof productCategories)[number];

export interface ProductCategoryInfo {
  slug: ProductCategory;
  name: LocalizedString;
  description: LocalizedString;
}

export interface Product {
  id: string;
  slug: string;
  name: LocalizedString;
  description: LocalizedString;
  category: ProductCategory;
  image: string;
  volumes: string[];
  fat: string | null;
  price: number | null;
  availability: "in-stock" | "out-of-stock" | null;
  isPlaceholder: boolean;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  createdAt: string;
  status: "new" | "read" | "replied";
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  volume?: string;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  address: string;
  notes?: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: "click" | "payme" | "cash";
  paymentStatus: "pending" | "paid" | "failed" | "cancelled";
  orderStatus: "new" | "confirmed" | "preparing" | "delivering" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}
