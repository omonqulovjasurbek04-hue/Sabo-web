import { products as initialProducts } from "@/data/products";
import { categories } from "@/data/categories";
import type { Product, ProductCategoryInfo, ThemeSettings } from "@/lib/types";

export interface UserRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  passwordHash?: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface ContactRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: string;
}

export interface OrderRecord {
  id: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  address: string;
  notes?: string;
  items: Array<{
    productId: string;
    quantity: number;
    volume?: string;
  }>;
  totalAmount: number;
  paymentMethod: "click" | "payme" | "cash";
  paymentStatus: "pending" | "paid" | "failed" | "cancelled";
  orderStatus: "new" | "confirmed" | "preparing" | "delivering" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

const defaultAdminUser: UserRecord = {
  id: "usr_admin_001",
  name: "Bekzodbek",
  phone: "+998901234567",
  email: "bekzodbek@sabo.uz",
  role: "admin",
  createdAt: new Date().toISOString(),
};

const usersStore = new Map<string, UserRecord>([
  [defaultAdminUser.id, defaultAdminUser],
]);
const contactStore: ContactRecord[] = [];
const ordersStore = new Map<string, OrderRecord>();

// Mutable products store
const productsStore = new Map<string, Product>(
  initialProducts.map((p) => [p.slug, { ...p }])
);

export const defaultThemeSettings: ThemeSettings = {
  palette: "natural",
  fontFamily: "jakarta",
  light: {
    primary: "#2F6B45",
    primaryHover: "#245436",
    primarySoft: "#E7F0E5",
    secondary: "#2F6B45",
    secondarySoft: "#F2F7F1",
    background: "#FDFCF7",
    surface: "#FFFFFF",
    surfaceElevated: "#F7F5EE",
    foreground: "#1B1E1B",
    muted: "#5F665D",
    border: "#E6E4D9",
    buttonBg: "#2F6B45",
    buttonText: "#FFFFFF",
    buttonHover: "#245436",
    actionRed: "#D9381E",
  },
  dark: {
    primary: "#4ade80",
    primaryHover: "#22c55e",
    primarySoft: "#14532d",
    secondary: "#86efac",
    secondarySoft: "#052e16",
    background: "#0F172A",
    surface: "#1E293B",
    surfaceElevated: "#334155",
    foreground: "#F8FAFC",
    muted: "#94A3B8",
    border: "#334155",
    buttonBg: "#22c55e",
    buttonText: "#0F172A",
    buttonHover: "#16a34a",
    actionRed: "#F87171",
  },
  brand: {
    logoUrl: "/images/logo.png",
    logoDarkUrl: "/images/logo.png",
    faviconUrl: "/icon.png",
    heroVideoUrl: "/video/sabo-milk-pour.mp4",
    productionVideoUrl: "/video/sabo-milk-pour.mp4",
    aboutVideoUrl: "/video/sabo-milk-pour.mp4",
    addOnsCatalog: [
      {
        id: "addon-eco-box",
        name: { uz: "Ekologik Sovg'a Qutisi", ru: "Эко-подарочная упаковка", en: "Eco Gift Box" },
        price: 5000,
        description: { uz: "Tabiiy qayta ishlangan karton qadoq", ru: "Коробка из переработанного картона", en: "Recycled craft box" },
      },
      {
        id: "addon-thermal-bag",
        name: { uz: "Sovuq Saqlovchi Termo-sumka", ru: "Термо-сумка охлаждающая", en: "Thermal Cooler Bag" },
        price: 12000,
        description: { uz: "Sutni 8 soat sovuq haroratda saqlaydi", ru: "Сохраняет холод до 8 часов", en: "Keeps milk cold for 8h" },
      },
      {
        id: "addon-spoon",
        name: { uz: "Ekologik Yog'och Qoshiq", ru: "Эко деревянная ложка", en: "Eco Wooden Spoon" },
        price: 2000,
        description: { uz: "Tabiiy qayinzor yog'ochidan", ru: "Из натуральной древесины", en: "Natural birch wood" },
      },
    ],
  },
  updatedAt: new Date().toISOString(),
};

let currentThemeSettings: ThemeSettings = { ...defaultThemeSettings };

export const db = {
  products: {
    findMany: (options?: { category?: string; search?: string; page?: number; limit?: number }) => {
      let list = Array.from(productsStore.values());
      if (options?.category) {
        list = list.filter((p) => p.category === options.category);
      }
      if (options?.search) {
        const q = options.search.toLowerCase();
        list = list.filter(
          (p) =>
            p.slug.toLowerCase().includes(q) ||
            p.name.uz.toLowerCase().includes(q) ||
            p.name.ru.toLowerCase().includes(q) ||
            p.name.en.toLowerCase().includes(q)
        );
      }
      const page = options?.page ?? 1;
      const limit = options?.limit ?? 50;
      const total = list.length;
      const totalPages = Math.ceil(total / limit);
      const data = list.slice((page - 1) * limit, page * limit);

      return { data, total, page, limit, totalPages };
    },
    findBySlug: (slug: string): Product | undefined => {
      if (productsStore.has(slug)) return productsStore.get(slug);
      for (const p of productsStore.values()) {
        if (p.id === slug || p.slug === slug) return p;
      }
      return undefined;
    },
    create: (product: Product): Product => {
      productsStore.set(product.slug, product);
      return product;
    },
    update: (slug: string, updates: Partial<Product>): Product | undefined => {
      const existing = db.products.findBySlug(slug);
      if (!existing) return undefined;
      const updated: Product = {
        ...existing,
        ...updates,
        slug: updates.slug || existing.slug,
      };
      if (existing.slug !== updated.slug) {
        productsStore.delete(existing.slug);
      }
      productsStore.set(updated.slug, updated);
      return updated;
    },
    delete: (slug: string): boolean => {
      const existing = db.products.findBySlug(slug);
      if (!existing) return false;
      return productsStore.delete(existing.slug);
    },
    reset: (): void => {
      productsStore.clear();
      initialProducts.forEach((p) => productsStore.set(p.slug, { ...p }));
    },
  },

  settings: {
    getTheme: (): ThemeSettings => {
      return currentThemeSettings;
    },
    updateTheme: (updates: Partial<ThemeSettings>): ThemeSettings => {
      currentThemeSettings = {
        ...currentThemeSettings,
        ...updates,
        light: updates.light ? { ...currentThemeSettings.light, ...updates.light } : currentThemeSettings.light,
        dark: updates.dark ? { ...currentThemeSettings.dark, ...updates.dark } : currentThemeSettings.dark,
        brand: updates.brand ? { ...currentThemeSettings.brand, ...updates.brand } : currentThemeSettings.brand,
        updatedAt: new Date().toISOString(),
      };
      return currentThemeSettings;
    },
    resetTheme: (): ThemeSettings => {
      currentThemeSettings = { ...defaultThemeSettings, updatedAt: new Date().toISOString() };
      return currentThemeSettings;
    },
  },

  categories: {
    findMany: (): ProductCategoryInfo[] => {
      return categories;
    },
    findBySlug: (slug: string): ProductCategoryInfo | undefined => {
      return categories.find((c) => c.slug === slug);
    },
  },

  users: {
    create: (user: Omit<UserRecord, "id" | "createdAt">): UserRecord => {
      const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const record: UserRecord = {
        ...user,
        id,
        createdAt: new Date().toISOString(),
      };
      usersStore.set(id, record);
      return record;
    },
    findByPhone: (phone: string): UserRecord | undefined => {
      for (const u of usersStore.values()) {
        if (u.phone === phone) return u;
      }
      return undefined;
    },
    findByEmail: (email: string): UserRecord | undefined => {
      for (const u of usersStore.values()) {
        if (u.email && u.email.toLowerCase() === email.toLowerCase()) return u;
      }
      return undefined;
    },
    findById: (id: string): UserRecord | undefined => {
      return usersStore.get(id);
    },
    findByIdentifier: (identifier: string): UserRecord | undefined => {
      const norm = identifier.trim().toLowerCase();
      if (norm === "bekzodbek" || norm === "bekzodbek@sabo.uz") {
        return defaultAdminUser;
      }
      for (const u of usersStore.values()) {
        if (
          u.phone === norm ||
          u.phone.replace(/[\s-()]/g, "") === norm.replace(/[\s-()]/g, "") ||
          (u.email && u.email.toLowerCase() === norm)
        ) {
          return u;
        }
      }
      return undefined;
    },
  },

  contact: {
    create: (msg: Omit<ContactRecord, "id" | "status" | "createdAt">): ContactRecord => {
      const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const record: ContactRecord = {
        ...msg,
        id,
        status: "new",
        createdAt: new Date().toISOString(),
      };
      contactStore.unshift(record);
      return record;
    },
    findMany: (): ContactRecord[] => {
      return contactStore;
    },
  },

  orders: {
    create: (order: Omit<OrderRecord, "id" | "paymentStatus" | "orderStatus" | "createdAt" | "updatedAt">): OrderRecord => {
      const id = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const now = new Date().toISOString();
      const record: OrderRecord = {
        ...order,
        id,
        paymentStatus: "pending",
        orderStatus: "new",
        createdAt: now,
        updatedAt: now,
      };
      ordersStore.set(id, record);
      return record;
    },
    findById: (id: string): OrderRecord | undefined => {
      return ordersStore.get(id);
    },
    updatePaymentStatus: (id: string, status: OrderRecord["paymentStatus"]): OrderRecord | undefined => {
      const order = ordersStore.get(id);
      if (!order) return undefined;
      order.paymentStatus = status;
      order.updatedAt = new Date().toISOString();
      return order;
    },
    findManyByUserId: (userId: string): OrderRecord[] => {
      return Array.from(ordersStore.values()).filter((o) => o.userId === userId);
    },
  },
};
