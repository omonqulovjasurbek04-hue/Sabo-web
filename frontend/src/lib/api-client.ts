import type { Product, ProductCategoryInfo, User, Order } from "@/lib/types";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    [key: string]: unknown;
  };
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(endpoint, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
    return (await res.json()) as ApiResponse<T>;
  } catch (err: unknown) {
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: err instanceof Error ? err.message : "Tarmoq xatosi",
      },
    };
  }
}

export const apiClient = {
  getHealth: () => request<{ status: string; timestamp: string }>("/api/v1/health"),
  getProducts: (params?: { category?: string; q?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);
    if (params?.q) query.set("q", params.q);
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());
    const qs = query.toString();
    return request<Product[]>(`/api/v1/products${qs ? `?${qs}` : ""}`);
  },
  getProductBySlug: (slug: string) => request<Product>(`/api/v1/products/${slug}`),
  getCategories: () => request<ProductCategoryInfo[]>("/api/v1/categories"),
  sendContactMessage: (payload: { name: string; phone: string; message: string; email?: string; subject?: string }) =>
    request<{ id: string; message: string }>("/api/v1/contact", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  register: (payload: { name: string; phone: string; password?: string; email?: string }) =>
    request<{ user: User; token: string }>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload: { phone?: string; email?: string; password?: string }) =>
    request<{ user: User; token: string }>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  logout: () =>
    request<{ message: string }>("/api/v1/auth/logout", {
      method: "POST",
    }),
  getMe: () => request<{ user: User }>("/api/v1/auth/me"),
  createOrder: (payload: {
    items: Array<{ productId: string; quantity: number; volume?: string }>;
    customerName: string;
    customerPhone: string;
    address: string;
    notes?: string;
    paymentMethod: "click" | "payme" | "cash";
  }) =>
    request<{ order: Order; paymentUrl?: string }>("/api/v1/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getOrderById: (id: string) => request<Order>(`/api/v1/orders/${id}`),
};
