import { productDisplayOverlay } from "@/data/products";
import type { Product, ProductVariantInfo } from "@/lib/types";

export interface ApiProductVariant {
  id: string;
  name?: string;
  volume: string | null;
  unit?: string | null;
  priceMinor: number | null;
  currency: string;
  isAvailable: boolean;
  isDefault: boolean;
}

export interface ApiProductImage {
  id: string;
  url: string | null;
  type?: string;
  altText?: string | null;
  isPrimary: boolean;
}

export interface ApiProduct {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: { id: string; slug: string; name: string } | null;
  images: ApiProductImage[];
  variants: ApiProductVariant[];
  availability: { status: string; stock: number | null } | null;
  nutrition?: {
    calories?: number | null;
    protein?: number | null;
    fat?: number | null;
    carbohydrates?: number | null;
    sugar?: number | null;
    additionalData?: { calcium?: number } | null;
  } | null;
  storage?: {
    temperatureMin?: number | null;
    temperatureMax?: number | null;
    shelfLife?: string | null;
    storageText?: string | null;
  } | null;
}

export function mapApiProduct(api: ApiProduct): Product {
  const overlay = productDisplayOverlay[api.slug];

  const imageUrls = (api.images || [])
    .slice()
    .sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))
    .map((img) => img.url)
    .filter((url): url is string => Boolean(url));

  const variants: ProductVariantInfo[] = (api.variants || []).map((v) => ({
    id: v.id,
    name: v.name,
    volume: v.volume,
    priceMinor: v.priceMinor,
    currency: v.currency,
    isAvailable: v.isAvailable,
    isDefault: v.isDefault,
  }));

  const defaultVariant =
    variants.find((v) => v.isDefault) || variants[0] || null;

  return {
    id: api.id,
    slug: api.slug,
    name: api.name,
    description: api.description,
    category: (api.category?.slug ?? "other") as Product["category"],
    image: imageUrls[0] || "/images/products/placeholder.jpg",
    galleryImages: imageUrls,
    volumes: variants
      .map((v) => v.volume)
      .filter((v): v is string => Boolean(v)),
    variants,
    fat: overlay?.fat ?? null,
    price:
      defaultVariant?.priceMinor != null
        ? defaultVariant.priceMinor / 100
        : null,
    availability:
      api.availability?.status === "AVAILABLE"
        ? "in-stock"
        : api.availability
          ? "out-of-stock"
          : null,
    isPlaceholder: false,
    colorAccent: overlay?.colorAccent,
    colorTheme: overlay?.colorTheme,
    badges: overlay?.badges,
    nutrition: api.nutrition
      ? {
          calories: api.nutrition.calories ?? 0,
          protein: api.nutrition.protein ?? 0,
          fat: api.nutrition.fat ?? 0,
          carbohydrates: api.nutrition.carbohydrates ?? 0,
          calcium: api.nutrition.additionalData?.calcium,
          sugar: api.nutrition.sugar ?? undefined,
        }
      : undefined,
    storage: api.storage
      ? {
          temperatureMin: api.storage.temperatureMin ?? 2,
          temperatureMax: api.storage.temperatureMax ?? 6,
          shelfLife: api.storage.shelfLife ?? "",
          storageText: api.storage.storageText ?? "",
        }
      : undefined,
  };
}
