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
  // Already resolved to the requested locale by the backend.
  shelfLife: string;
  storageText: string;
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

export interface ProductVariantInfo {
  id: string;
  name?: string;
  volume: string | null;
  priceMinor: number | null;
  currency: string;
  isAvailable: boolean;
  isDefault: boolean;
}

export interface Product {
  id: string;
  slug: string;
  // Already resolved to the requested locale by the backend — not a LocalizedString.
  name: string;
  description: string | null;
  category: ProductCategory;
  image: string;
  galleryImages?: string[];
  volumes: string[];
  variants: ProductVariantInfo[];
  fat: string | null;
  price: number | null;
  availability: "in-stock" | "out-of-stock" | null;
  isPlaceholder: boolean;
  colorAccent?: string; // hex or CSS token (e.g. "#2F6B45", "#95BFEE") — local display-only, no backend field
  colorTheme?: "green" | "blue" | "red" | "amber" | "emerald" | "berry";
  badges?: LocalizedString[]; // local display-only, no backend field
  nutrition?: ProductNutritionInfo;
  storage?: ProductStorageInfo;
  ingredients?: LocalizedString;
  addOns?: ProductAddOn[]; // local display-only, no backend field
}

export interface User {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  role: string;
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
