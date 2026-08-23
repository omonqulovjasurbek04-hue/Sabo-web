import { products } from "@/data/products";
import { categories } from "@/data/categories";
import type { Product, ProductCategoryInfo } from "@/lib/types";

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
  name: "Administrator",
  phone: "+998901234567",
  email: "admin@sabo.uz",
  role: "admin",
  createdAt: new Date().toISOString(),
};

const usersStore = new Map<string, UserRecord>([
  [defaultAdminUser.id, defaultAdminUser],
]);
const contactStore: ContactRecord[] = [];
const ordersStore = new Map<string, OrderRecord>();

export const db = {
  products: {
    findMany: (options?: { category?: string; search?: string; page?: number; limit?: number }) => {
      let list = [...products];
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
      const limit = options?.limit ?? 20;
      const total = list.length;
      const totalPages = Math.ceil(total / limit);
      const data = list.slice((page - 1) * limit, page * limit);

      return { data, total, page, limit, totalPages };
    },
    findBySlug: (slug: string): Product | undefined => {
      return products.find((p) => p.slug === slug || p.id === slug);
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
      if (norm === "admin" || norm === "sabo_admin" || norm === "administrator") {
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
