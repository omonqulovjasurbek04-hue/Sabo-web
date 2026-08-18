export type Language = 'uz' | 'ru' | 'en';

export type ProductCategory = 'all' | 'milk' | 'kefir_yogurt' | 'sourcream_butter' | 'cheese' | 'desserts';

export interface NutritionFacts {
  calories: number; // in kcal per 100g
  proteins: number; // in g
  fats: number;     // in g
  carbohydrates: number; // in g
}

export interface ProductVolumeOption {
  volume: string;
  price: number;
  isDefault?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: {
    uz: string;
    ru: string;
    en: string;
  };
  shortDescription: {
    uz: string;
    ru: string;
    en: string;
  };
  fullDescription: {
    uz: string;
    ru: string;
    en: string;
  };
  category: ProductCategory;
  categoryLabel: {
    uz: string;
    ru: string;
    en: string;
  };
  images: string[];
  fatContent: string; // e.g. "3.2%", "82.5%", "20%"
  volumeOptions: ProductVolumeOption[];
  isOrganic?: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
  isLactoseFree?: boolean;
  shelfLife: {
    uz: string;
    ru: string;
    en: string;
  };
  storageConditions: {
    uz: string;
    ru: string;
    en: string;
  };
  ingredients: {
    uz: string;
    ru: string;
    en: string;
  };
  nutrition: NutritionFacts;
  certifications: string[]; // ['ISO 9001', 'HACCP', 'Halol', 'Organic']
  rating: number;
  reviewsCount: number;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  selectedVolume: string;
  price: number;
  quantity: number;
}

export interface OrderCustomerInfo {
  fullName: string;
  phone: string;
  email?: string;
  region: string;
  address: string;
  notes?: string;
  paymentMethod: 'click' | 'payme' | 'cash' | 'card';
  deliveryDate?: string;
  deliveryTimeSlot?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  customer: OrderCustomerInfo;
}

export interface Certificate {
  id: string;
  title: string;
  code: string;
  badge: {
    uz: string;
    ru: string;
    en: string;
  };
  issueDate: string;
  issuer: string;
  description: {
    uz: string;
    ru: string;
    en: string;
  };
  image: string;
  pdfUrl?: string;
}

export interface Article {
  id: string;
  slug: string;
  category: 'news' | 'recipes' | 'awards' | 'exhibitions';
  title: {
    uz: string;
    ru: string;
    en: string;
  };
  excerpt: {
    uz: string;
    ru: string;
    en: string;
  };
  content: {
    uz: string;
    ru: string;
    en: string;
  };
  date: string;
  image: string;
  readTime: string;
  author: string;
  recipeIngredients?: {
    uz: string[];
    ru: string[];
    en: string[];
  };
}

export interface BranchOffice {
  id: string;
  city: {
    uz: string;
    ru: string;
    en: string;
  };
  address: {
    uz: string;
    ru: string;
    en: string;
  };
  phone: string;
  email: string;
  workingHours: {
    uz: string;
    ru: string;
    en: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  isHeadquarter?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: {
    uz: string;
    ru: string;
    en: string;
  };
  bio: {
    uz: string;
    ru: string;
    en: string;
  };
  image: string;
}

export interface ContactFormData {
  name: string;
  company?: string;
  phone: string;
  email: string;
  location: string;
  type: string;
  message: string;
}
