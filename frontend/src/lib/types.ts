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

export interface ProductAddOn {
  id: string;
  name: LocalizedString;
  price: number;
  description?: LocalizedString;
  icon?: string;
}

export interface ProductNutritionInfo {
  calories: number; // kcal per 100g/100ml
  protein: number;  // g
  fat: number;      // g
  carbohydrates: number; // g
  calcium?: number; // mg
  sugar?: number;   // g
}

export interface ProductStorageInfo {
  temperatureMin: number;
  temperatureMax: number;
  shelfLife: LocalizedString;
  storageText: LocalizedString;
}

export interface ProductCertificateItem {
  id: string;
  title: LocalizedString;
  certNumber: string;
  issuer: string;
  validUntil: string;
  previewImage: string;
  documentUrl: string;
}

export interface MediaFileItem {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  folder: "products" | "certificates" | "heroes" | "nature" | "gallery" | "general";
  altText?: string | null;
  createdAt: string;
  width?: number | null;
  height?: number | null;
}

export interface Product {
  id: string;
  slug: string;
  name: LocalizedString;
  description: LocalizedString;
  category: ProductCategory;
  image: string;
  galleryImages?: string[];
  volumes: string[];
  fat: string | null;
  price: number | null;
  availability: "in-stock" | "out-of-stock" | null;
  isPlaceholder: boolean;
  colorAccent?: string; // hex or CSS token (e.g. "#2F6B45", "#95BFEE")
  colorTheme?: "green" | "blue" | "red" | "amber" | "emerald" | "berry";
  badges?: LocalizedString[];
  nutrition?: ProductNutritionInfo;
  storage?: ProductStorageInfo;
  ingredients?: LocalizedString;
  addOns?: ProductAddOn[];
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
  productName?: string;
  quantity: number;
  price: number;
  volume?: string;
  addOns?: ProductAddOn[];
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

export interface ThemeModeColors {
  primary: string;
  primaryHover: string;
  primarySoft: string;
  secondary: string;
  secondarySoft: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  foreground: string;
  muted: string;
  border: string;
  buttonBg: string;
  buttonText: string;
  buttonHover: string;
  actionRed: string;
}

export interface BrandSettings {
  logoUrl?: string;
  logoDarkUrl?: string;
  faviconUrl?: string;
  heroVideoUrl?: string;
  productionVideoUrl?: string;
  aboutVideoUrl?: string;
  bannerText?: LocalizedString;
  bannerEnabled?: boolean;
  addOnsCatalog?: ProductAddOn[];
}

export interface ThemeSettings {
  palette: "natural" | "emerald" | "sky" | "berry" | "amber" | "custom";
  fontFamily: "inter" | "jakarta" | "outfit" | "playfair";
  light: ThemeModeColors;
  dark: ThemeModeColors;
  brand?: BrandSettings;
  updatedAt: string;
}
