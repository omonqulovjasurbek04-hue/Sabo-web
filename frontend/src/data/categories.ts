import type { ProductCategory, ProductCategoryInfo } from "@/lib/types";

export const categories: ProductCategoryInfo[] = [
  {
    slug: "milk",
    name: { uz: "Sut", ru: "Молоко", en: "Milk" },
    description: {
      uz: "Tabiiy sigir suti",
      ru: "Натуральное коровье молоко",
      en: "Natural cow milk",
    },
  },
  {
    slug: "kefir",
    name: { uz: "Kefir", ru: "Кефир", en: "Kefir" },
    description: {
      uz: "Toza va foydali kefir",
      ru: "Чистый и полезный кефир",
      en: "Clean and healthy kefir",
    },
  },
  {
    slug: "yogurt",
    name: { uz: "Yogurt", ru: "Йогурт", en: "Yogurt" },
    description: {
      uz: "Yumshoq va mazali yogurt",
      ru: "Нежный и вкусный йогурт",
      en: "Soft and tasty yogurt",
    },
  },
  {
    slug: "sour-cream",
    name: { uz: "Qaymoq (smetana)", ru: "Сметана", en: "Sour cream" },
    description: {
      uz: "Qaymoq mahsulotlari",
      ru: "Сметанные продукты",
      en: "Sour cream products",
    },
  },
  {
    slug: "cream",
    name: { uz: "Qaymoq (krem)", ru: "Сливки", en: "Cream" },
    description: {
      uz: "Yumshoq qaymoq",
      ru: "Нежные сливки",
      en: "Smooth cream",
    },
  },
  {
    slug: "butter",
    name: { uz: "Sariyog'", ru: "Сливочное масло", en: "Butter" },
    description: {
      uz: "Tabiiy sariyog'",
      ru: "Натуральное сливочное масло",
      en: "Natural butter",
    },
  },
  {
    slug: "other",
    name: { uz: "Boshqa", ru: "Другие", en: "Other" },
    description: {
      uz: "Boshqa sut mahsulotlari",
      ru: "Другие молочные продукты",
      en: "Other dairy products",
    },
  },
];

export function getCategory(slug: string): ProductCategoryInfo | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getCategoryBySlug(
  slug: ProductCategory,
): ProductCategoryInfo {
  const found = getCategory(slug);
  if (!found) {
    throw new Error(`Unknown category: ${slug}`);
  }
  return found;
}
