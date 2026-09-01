import type { LocalizedString } from "@/lib/types";

/**
 * Cosmetic, non-transactional per-product display data that has no equivalent
 * column in the backend's commerce schema (Product/ProductVariant). Product
 * existence, pricing, stock, images, and content now come live from the API
 * (see @/lib/api-client and @/lib/product-mapper) — this map only supplies
 * accent colors, theme, marketing badges, and the "fat %" label shown next to
 * the product name, keyed by product slug.
 */
export interface ProductDisplayOverlay {
  colorAccent: string;
  colorTheme: "green" | "blue" | "red" | "amber" | "emerald" | "berry";
  badges: LocalizedString[];
  fat: string | null;
}

export const productDisplayOverlay: Record<string, ProductDisplayOverlay> = {
  "sabo-sut-3-2-1l": {
    colorAccent: "#0284C7",
    colorTheme: "blue",
    fat: "3.2%",
    badges: [
      { uz: "100% Tabiiy", ru: "100% Натуральное", en: "100% Natural" },
      { uz: "Eko Sifat", ru: "Эко Качество", en: "Eco Quality" },
    ],
  },
  "sabo-sutim-1l": {
    colorAccent: "#2F6B45",
    colorTheme: "green",
    fat: "2.5%",
    badges: [
      { uz: "Yengil Ta'm", ru: "Легкий Вкус", en: "Light Taste" },
      { uz: "Kalsiyga Boy", ru: "Богато Кальцием", en: "Rich in Calcium" },
    ],
  },
  "sabo-kefir-1l": {
    colorAccent: "#15803D",
    colorTheme: "emerald",
    fat: "3.2%",
    badges: [
      { uz: "Tirik Bakteriyalar", ru: "Живые Бактерии", en: "Live Probiotics" },
      { uz: "Hazmga Foydali", ru: "Для Пищеварения", en: "Digestive Health" },
    ],
  },
  "sabo-kefir-05l": {
    colorAccent: "#15803D",
    colorTheme: "emerald",
    fat: "3.2%",
    badges: [{ uz: "Ixcham Format", ru: "Компактный Формат", en: "On-the-go" }],
  },
  "sabo-yogurt-450g": {
    colorAccent: "#BE123C",
    colorTheme: "berry",
    fat: "2.5%",
    badges: [
      { uz: "Tabiiy Mevali Lazzat", ru: "Нежный Вкус", en: "Creamy Delight" },
      { uz: "Shakarsiz", ru: "Без Лишнего Сахара", en: "Pure Recipe" },
    ],
  },
  "sabo-smetana-400g": {
    colorAccent: "#B45309",
    colorTheme: "amber",
    fat: "20%",
    badges: [
      { uz: "Quyuq va Mayin", ru: "Густая Сметана", en: "Thick Cream" },
      { uz: "Traditsion Retsept", ru: "Традиционный", en: "Traditional" },
    ],
  },
  "sabo-qaymoq-400g": {
    colorAccent: "#B45309",
    colorTheme: "amber",
    fat: "35%",
    badges: [
      { uz: "Haqiqiy Qaymoq", ru: "Настоящий Каймак", en: "Authentic Qaymoq" },
      { uz: "Milliy Ta'm", ru: "Традиция Вкуса", en: "National Taste" },
    ],
  },
};
