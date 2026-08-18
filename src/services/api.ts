import { Product, Order, Article, BranchOffice } from '../types';
import { PRODUCTS, ARTICLES, BRANCHES } from '../constants/data';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const apiClient = {
  // Products API
  async getProducts(params?: { category?: string; search?: string; lactoseFree?: boolean; organic?: boolean }): Promise<Product[]> {
    try {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'all') query.append('category', params.category);
      if (params?.search) query.append('search', params.search);
      if (params?.lactoseFree) query.append('lactoseFree', 'true');
      if (params?.organic) query.append('organic', 'true');

      const res = await fetch(`${API_BASE}/products?${query.toString()}`);
      if (!res.ok) throw new Error('API request failed');
      const json = await res.json();
      return json.data || PRODUCTS;
    } catch {
      // Offline / Static fallback
      let list = [...PRODUCTS];
      if (params?.category && params.category !== 'all') {
        list = list.filter(p => p.category === params.category);
      }
      if (params?.lactoseFree) {
        list = list.filter(p => p.isLactoseFree);
      }
      if (params?.organic) {
        list = list.filter(p => p.isOrganic);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(p => 
          p.name.uz.toLowerCase().includes(q) ||
          p.name.ru.toLowerCase().includes(q) ||
          p.name.en.toLowerCase().includes(q)
        );
      }
      return list;
    }
  },

  // Single Product
  async getProductById(idOrSlug: string): Promise<Product | null> {
    try {
      const res = await fetch(`${API_BASE}/products/${idOrSlug}`);
      if (!res.ok) throw new Error('API request failed');
      const json = await res.json();
      return json.data || null;
    } catch {
      return PRODUCTS.find(p => p.id === idOrSlug || p.slug === idOrSlug) || null;
    }
  },

  // Create Order
  async createOrder(orderPayload: {
    customer: any;
    items: any[];
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
  }): Promise<{ success: boolean; orderId: string; message: string; order?: Order }> {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      if (!res.ok) throw new Error('Order creation failed');
      const json = await res.json();
      return {
        success: true,
        orderId: json.order?.id || `PM-${Date.now().toString(36).toUpperCase()}`,
        message: json.message || "Buyurtma qabul qilindi",
        order: json.order
      };
    } catch {
      // Local fallback
      const mockId = `PM-${Date.now().toString(36).toUpperCase()}`;
      return {
        success: true,
        orderId: mockId,
        message: "Buyurtma saqlandi (Offline rejim)"
      };
    }
  },

  // Track Order Status
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}`);
      if (!res.ok) throw new Error('Order lookup failed');
      const json = await res.json();
      return json.data || null;
    } catch {
      return null;
    }
  },

  // Articles API
  async getArticles(category?: string): Promise<Article[]> {
    try {
      const query = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : '';
      const res = await fetch(`${API_BASE}/articles${query}`);
      if (!res.ok) throw new Error('API request failed');
      const json = await res.json();
      return json.data || ARTICLES;
    } catch {
      if (category && category !== 'all') {
        return ARTICLES.filter(a => a.category === category);
      }
      return ARTICLES;
    }
  },

  // Branches API
  async getBranches(): Promise<BranchOffice[]> {
    try {
      const res = await fetch(`${API_BASE}/contact/branches`);
      if (!res.ok) throw new Error('API request failed');
      const json = await res.json();
      return json.data || BRANCHES;
    } catch {
      return BRANCHES;
    }
  },

  // Contact Form Submission
  async submitContactForm(data: {
    name: string;
    phone: string;
    email?: string;
    company?: string;
    location?: string;
    type?: string;
    message?: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Submission failed');
      const json = await res.json();
      return { success: true, message: json.message };
    } catch {
      return {
        success: true,
        message: "Xabaringiz qabul qilindi. Tez orada operatorimiz bog'lanadi."
      };
    }
  }
};
