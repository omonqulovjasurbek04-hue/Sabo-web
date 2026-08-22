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
    volumes: ["1 L"],
    fat: "3.2%",
    price: null,
    availability: "in-stock",
    isPlaceholder: false,
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
    volumes: ["1 L"],
    fat: "2.5%",
    price: null,
    availability: "in-stock",
    isPlaceholder: false,
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
    volumes: ["1 L"],
    fat: "3.2%",
    price: null,
    availability: "in-stock",
    isPlaceholder: false,
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
    volumes: ["0.5 L"],
    fat: "3.2%",
    price: null,
    availability: "in-stock",
    isPlaceholder: false,
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
    volumes: ["450 g"],
    fat: "2.5%",
    price: null,
    availability: "in-stock",
    isPlaceholder: false,
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
    volumes: ["400 g"],
    fat: "20%",
    price: null,
    availability: "in-stock",
    isPlaceholder: false,
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
    volumes: ["400 g"],
    fat: "35%",
    price: null,
    availability: "in-stock",
    isPlaceholder: false,
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