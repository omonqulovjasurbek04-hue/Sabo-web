import fs from 'fs';
import path from 'path';
import { Product, Order, Article, BranchOffice, Certificate } from '../types';

export interface ReviewItem {
  id: string;
  productId: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
}

export interface ContactSubmission {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  location?: string;
  type?: string;
  message?: string;
  status: 'new' | 'contacted' | 'resolved';
}

// In-Memory Database store with optional disk sync
export const db = {
  products: [] as Product[],
  orders: [] as Order[],
  articles: [] as Article[],
  certificates: [] as Certificate[],
  branches: [] as BranchOffice[],
  contactSubmissions: [] as ContactSubmission[],
  reviews: [] as ReviewItem[]
};

const DB_FILE_PATH = path.resolve(process.cwd(), 'server', 'db', 'data.json');

// Save current state to local JSON file for persistence
export function persistDatabase(): void {
  try {
    const dataToSave = {
      orders: db.orders,
      contactSubmissions: db.contactSubmissions,
      reviews: db.reviews,
      lastSaved: new Date().toISOString()
    };
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(dataToSave, null, 2), 'utf-8');
  } catch (error) {
    // Non-blocking in serverless/read-only environments
    console.warn('⚠️ [DB Persistence] Diskka yozishda ogohlantirish (in-memory saqlandi):', error instanceof Error ? error.message : error);
  }
}

// Load persisted state if exists
function loadPersistedData(): void {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const fileData = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(fileData);
      if (Array.isArray(parsed.orders)) db.orders = parsed.orders;
      if (Array.isArray(parsed.contactSubmissions)) db.contactSubmissions = parsed.contactSubmissions;
      if (Array.isArray(parsed.reviews)) db.reviews = parsed.reviews;
    }
  } catch (error) {
    console.warn('⚠️ [DB Persistence] Diskdan o\'qishda xatolik:', error instanceof Error ? error.message : error);
  }
}

// Initial Seed Data Loader
export function seedDatabase(initialData: {
  products: Product[];
  articles: Article[];
  certificates: Certificate[];
  branches: BranchOffice[];
}) {
  db.products = [...initialData.products];
  db.articles = [...initialData.articles];
  db.certificates = [...initialData.certificates];
  db.branches = [...initialData.branches];

  // Try to load any persisted dynamic records
  loadPersistedData();
}

// Database helper functions
export const dbHelpers = {
  // Orders
  saveOrder(order: Order): Order {
    db.orders.unshift(order);
    persistDatabase();
    return order;
  },

  findOrderById(id: string): Order | undefined {
    return db.orders.find(o => o.id === id);
  },

  updateOrderStatus(id: string, status: Order['status']): Order | null {
    const order = db.orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      persistDatabase();
      return order;
    }
    return null;
  },

  // Contact
  saveContactSubmission(data: Omit<ContactSubmission, 'id' | 'createdAt' | 'status'>): ContactSubmission {
    const submission: ContactSubmission = {
      id: `REQ-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`,
      createdAt: new Date().toISOString(),
      status: 'new',
      ...data
    };
    db.contactSubmissions.unshift(submission);
    persistDatabase();
    return submission;
  },

  // Reviews
  addReview(productId: string, name: string, rating: number, comment: string): ReviewItem {
    const review: ReviewItem = {
      id: `REV-${Date.now()}`,
      productId,
      name,
      rating,
      date: new Date().toISOString().split('T')[0],
      comment
    };
    db.reviews.unshift(review);

    // Update product rating stats
    const product = db.products.find(p => p.id === productId || p.slug === productId);
    if (product) {
      const productReviews = db.reviews.filter(r => r.productId === product.id || r.productId === product.slug);
      const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
      product.rating = Number((totalRating / productReviews.length).toFixed(1));
      product.reviewsCount = productReviews.length;
    }

    persistDatabase();
    return review;
  },

  getProductReviews(productId: string): ReviewItem[] {
    return db.reviews.filter(r => r.productId === productId);
  }
};
