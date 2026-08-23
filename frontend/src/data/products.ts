import type { Product } from "@/lib/types";

/**
 * SABO REAL PRODUCTS DATA
 * 
 * Authentic packaging photos from image/ directory
 */
export const products: Product[] = [
  {
    id: "sabo-milk-1l",
    slug: "sabo-sut-3-2-1l",
    name: { uz: "SABO Sut 3.2%", ru: "SABO Молоко 3.2%", en: "SABO Milk 3.2%" },
    description: {
      uz: "Tabiiy va toza sigir suti. Yangi sog'ilgan sutning tabiiy ta'mi va foydali moddalari to'liq saqlangan.",
      ru: "Натуральное отборное коровье молоко. Сохранен натуральный вкус и польза свежего молока.",
      en: "Natural premium cow milk. Preserved natural fresh taste and rich nutrients.",
    },
    category: "milk",
    image: "/images/products/Sabo_Milk.jpg",
    galleryImages: [
      "/images/products/Sabo_Milk.jpg",
      "/images/photo_2026-08-20_02-35-47.jpg",
      "/images/photo_2026-08-20_02-36-37.jpg",
      "/images/photo_2026-08-20_02-38-16.jpg",
    ],
    volumes: ["1 L", "1.5 L"],
    fat: "3.2%",
    price: 13000,
    availability: "in-stock",
    isPlaceholder: false,
    colorAccent: "#0284C7",
    colorTheme: "blue",
    badges: [
      { uz: "100% Tabiiy", ru: "100% Натуральное", en: "100% Natural" },
      { uz: "Eko Sifat", ru: "Эко Качество", en: "Eco Quality" },
    ],
    nutrition: {
      calories: 60,
      protein: 3.0,
      fat: 3.2,
      carbohydrates: 4.7,
      calcium: 120,
      sugar: 4.6,
    },
    storage: {
      temperatureMin: 2,
      temperatureMax: 6,
      shelfLife: { uz: "10 kun", ru: "10 дней", en: "10 days" },
      storageText: {
        uz: "Muzlatgichda saqlansin. Qadoq ochilgach 48 soatda iste'mol qiling.",
        ru: "Хранить в холодильнике. После вскрытия употребить за 48 часов.",
        en: "Store refrigerated. Consume within 48h after opening.",
      },
    },
  },
  {
    id: "sabo-sutim-1l",
    slug: "sabo-sutim-1l",
    name: { uz: "SABO Sutim 2.5%", ru: "SABO Sutim 2.5%", en: "SABO Sutim 2.5%" },
    description: {
      uz: "Kundalik iste'mol uchun yengil va to'yimli tabiiy sut.",
      ru: "Легкое и питательное натуральное молоко для ежедневного употребления.",
      en: "Light and nutritious fresh milk for daily family enjoyment.",
    },
    category: "milk",
    image: "/images/products/SaboSutim.jpg",
    galleryImages: [
      "/images/products/SaboSutim.jpg",
      "/images/photo_2026-08-20_02-36-40.jpg",
      "/images/photo_2026-08-20_02-38-18.jpg",
    ],
    volumes: ["1 L"],
    fat: "2.5%",
    price: 11500,
    availability: "in-stock",
    isPlaceholder: false,
    colorAccent: "#2F6B45",
    colorTheme: "green",
    badges: [
      { uz: "Yengil Ta'm", ru: "Легкий Вкус", en: "Light Taste" },
      { uz: "Kalsiyga Boy", ru: "Богато Кальцием", en: "Rich in Calcium" },
    ],
    nutrition: {
      calories: 52,
      protein: 2.9,
      fat: 2.5,
      carbohydrates: 4.7,
      calcium: 115,
      sugar: 4.5,
    },
  },
  {
    id: "sabo-kefir-1l",
    slug: "sabo-kefir-1l",
    name: { uz: "SABO Kefir 1L", ru: "SABO Кефир 1L", en: "SABO Kefir 1L" },
    description: {
      uz: "Tabiiy tirik achitqi asosida tayyorlangan yumshoq va to'yimli kefir.",
      ru: "Нежный и полезный кефир на натуральной живой закваске.",
      en: "Smooth and nutritious kefir made with natural live culture.",
    },
    category: "kefir",
    image: "/images/products/Sabo_Kefir.jpg",
    galleryImages: [
      "/images/products/Sabo_Kefir.jpg",
      "/images/products/Sabo_Kefir_05.jpg",
      "/images/photo_2026-08-20_02-38-22.jpg",
    ],
    volumes: ["1 L"],
    fat: "3.2%",
    price: 13500,
    availability: "in-stock",
    isPlaceholder: false,
    colorAccent: "#15803D",
    colorTheme: "emerald",
    badges: [
      { uz: "Tirik Bakteriyalar", ru: "Живые Бактерии", en: "Live Probiotics" },
      { uz: "Hazmga Foydali", ru: "Для Пищеварения", en: "Digestive Health" },
    ],
    nutrition: {
      calories: 56,
      protein: 3.1,
      fat: 3.2,
      carbohydrates: 4.0,
      calcium: 130,
      sugar: 3.8,
    },
  },
  {
    id: "sabo-kefir-05l",
    slug: "sabo-kefir-05l",
    name: { uz: "SABO Kefir 0.5L", ru: "SABO Кефир 0.5L", en: "SABO Kefir 0.5L" },
    description: {
      uz: "Qulay ixcham hajmda tabiiy va sog'lom kefir.",
      ru: "Натуральный полезный кефир в удобном компактном формате.",
      en: "Pure healthy kefir in a convenient on-the-go bottle.",
    },
    category: "kefir",
    image: "/images/products/Sabo_Kefir_05.jpg",
    galleryImages: [
      "/images/products/Sabo_Kefir_05.jpg",
      "/images/products/Sabo_Kefir.jpg",
      "/images/photo_2026-08-20_02-38-28.jpg",
    ],
    volumes: ["0.5 L"],
    fat: "3.2%",
    price: 8000,
    availability: "in-stock",
    isPlaceholder: false,
    colorAccent: "#15803D",
    colorTheme: "emerald",
    badges: [
      { uz: "Ixcham Format", ru: "Компактный Формат", en: "On-the-go" },
    ],
  },
  {
    id: "sabo-yogurt-450g",
    slug: "sabo-yogurt-450g",
    name: { uz: "SABO Yogurt", ru: "SABO Йогурт", en: "SABO Yogurt" },
    description: {
      uz: "Yumshoq va tabiiy yogurt, butun oila uchun foydali va lazzatli.",
      ru: "Нежный натуральный йогурт, полезный и вкусный для всей семьи.",
      en: "Smooth natural yogurt, healthy and delicious for the whole family.",
    },
    category: "yogurt",
    image: "/images/products/Sabo_Yogurt.jpg",
    galleryImages: [
      "/images/products/Sabo_Yogurt.jpg",
      "/images/photo_2026-08-20_02-38-45.jpg",
      "/images/photo_2026-08-20_02-39-21.jpg",
    ],
    volumes: ["450 g"],
    fat: "2.5%",
    price: 14000,
    availability: "in-stock",
    isPlaceholder: false,
    colorAccent: "#BE123C",
    colorTheme: "berry",
    badges: [
      { uz: "Tabiiy Mevali Lazzat", ru: "Нежный Вкус", en: "Creamy Delight" },
      { uz: "Shakarsiz", ru: "Без Лишнего Сахара", en: "Pure Recipe" },
    ],
    nutrition: {
      calories: 68,
      protein: 3.4,
      fat: 2.5,
      carbohydrates: 6.2,
      calcium: 125,
      sugar: 5.0,
    },
  },
  {
    id: "sabo-smetana-400g",
    slug: "sabo-smetana-400g",
    name: {
      uz: "SABO Smetana 20%",
      ru: "SABO Сметана 20%",
      en: "SABO Sour Cream 20%",
    },
    description: {
      uz: "Quyuq va mayin smetana, tabiiy qaymoqdan an'anaviy usulda tayyorlangan.",
      ru: "Густая и нежная сметана из натуральных свежих сливок.",
      en: "Rich and creamy smetana crafted from fresh natural cream.",
    },
    category: "sour-cream",
    image: "/images/products/Sabo_Smetana.jpg",
    galleryImages: [
      "/images/products/Sabo_Smetana.jpg",
      "/images/photo_2026-08-20_02-39-25.jpg",
      "/images/photo_2026-08-20_02-39-28.jpg",
    ],
    volumes: ["400 g"],
    fat: "20%",
    price: 17000,
    availability: "in-stock",
    isPlaceholder: false,
    colorAccent: "#B45309",
    colorTheme: "amber",
    badges: [
      { uz: "Quyuq va Mayin", ru: "Густая Сметана", en: "Thick Cream" },
      { uz: "Traditsion Retsept", ru: "Традиционный", en: "Traditional" },
    ],
    nutrition: {
      calories: 206,
      protein: 2.5,
      fat: 20.0,
      carbohydrates: 3.4,
      calcium: 90,
      sugar: 3.2,
    },
  },
  {
    id: "sabo-qaymoq-400g",
    slug: "sabo-qaymoq-400g",
    name: {
      uz: "SABO Qaymoq",
      ru: "SABO Сливки / Каймак",
      en: "SABO Cream / Qaymoq",
    },
    description: {
      uz: "Tabiiy sut qaymog'i — haqiqiy milliy lazzat va boy ta'm.",
      ru: "Натуральные сливки (каймак) с традиционным богатым вкусом.",
      en: "Pure natural cream (qaymoq) with authentic rich traditional flavor.",
    },
    category: "cream",
    image: "/images/products/Sabo_Qaymoq.jpg",
    galleryImages: [
      "/images/products/Sabo_Qaymoq.jpg",
      "/images/photo_2026-08-20_02-39-38.jpg",
      "/images/photo_2026-08-20_02-39-41.jpg",
    ],
    volumes: ["400 g"],
    fat: "35%",
    price: 24000,
    availability: "in-stock",
    isPlaceholder: false,
    colorAccent: "#B45309",
    colorTheme: "amber",
    badges: [
      { uz: "Haqiqiy Qaymoq", ru: "Настоящий Каймак", en: "Authentic Qaymoq" },
      { uz: "Milliy Ta'm", ru: "Традиция Вкуса", en: "National Taste" },
    ],
    nutrition: {
      calories: 335,
      protein: 2.2,
      fat: 35.0,
      carbohydrates: 2.8,
      calcium: 80,
      sugar: 2.6,
    },
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  return products
    .filter((item) => item.id !== product.id)
    .sort((a, b) => {
      const score = (p: Product) =>
        (p.category === product.category ? 1 : 0) + (p.isPlaceholder === product.isPlaceholder ? 1 : 0);
      return score(b) - score(a);
    })
    .slice(0, limit);
}