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