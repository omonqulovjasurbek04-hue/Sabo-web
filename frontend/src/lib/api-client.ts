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

const API_BASE =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || "/api/v1"
    : process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("sabo_token") : null;
    const authHeader: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
        ...(options.headers || {}),
      },
    });

    const json = (await res.json()) as ApiResponse<T> & { message?: string };
    if (!res.ok && !json.error) {
      return {
        success: false,
        error: {
          code: `HTTP_${res.status}`,
          message: json.message || "Xatolik yuz berdi",
        },
      };
    }
    return json;
  } catch (err: unknown) {
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: err instanceof Error ? err.message : "Tarmoq xatosi yuz berdi",
      },
    };
  }
}

export const apiClient = {
  getHealth: () => request<{ status: string; timestamp: string }>("/health"),
  getProducts: (params?: { category?: string; q?: string; page?: number; limit?: number; locale?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);
    if (params?.q) query.set("q", params.q);
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());
    if (params?.locale) query.set("locale", params.locale);
    const qs = query.toString();
    return request<Product[]>(`/products${qs ? `?${qs}` : ""}`);
  },
  getProductBySlug: (slug: string, locale?: string) =>
    request<Product>(`/products/${slug}${locale ? `?locale=${locale}` : ""}`),
  getCategories: (locale?: string) =>
    request<ProductCategoryInfo[]>(`/categories${locale ? `?locale=${locale}` : ""}`),
  sendContactMessage: (payload: { name: string; phone: string; message: string; email?: string; subject?: string }) =>
    request<{ id: string; message: string }>("/contact", {
      method: "POST",
      body: JSON.stringify({
        name: payload.name,
        phone: payload.phone,
        email: payload.email || undefined,
        message: payload.message,
        subject: payload.subject || undefined,
      }),
    }),
  register: (payload: { name?: string; firstName?: string; lastName?: string; phone: string; password?: string; email?: string }) => {
    const parts = (payload.name || "").trim().split(" ");
    const firstName = payload.firstName || parts[0] || "Mijoz";
    const lastName = payload.lastName || parts.slice(1).join(" ") || undefined;
    return request<{ user: User; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        firstName,
        lastName,
        phone: payload.phone,
        email: payload.email || undefined,
        password: payload.password || "SaboDefault123!",
      }),
    });
  },
  login: (payload: { identifier?: string; phone?: string; email?: string; password?: string }) =>
    request<{ user: User; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        identifier: payload.identifier || payload.phone || payload.email || "",
        password: payload.password || "",
      }),
    }),
  logout: () =>
    request<{ message: string }>("/auth/logout", {
      method: "POST",
    }),
  getMe: () => request<{ user: User }>("/auth/me"),
  createOrder: (payload: {
    items: Array<{ productId?: string; productVariantId?: string; quantity: number; volume?: string }>;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    address: string | { recipientName?: string; phone?: string; city?: string; street?: string };
    notes?: string;
    note?: string;
    paymentMethod?: "click" | "payme" | "cash" | "CLICK" | "PAYME" | "CASH";
    paymentProvider?: "CLICK" | "PAYME" | "CASH";
  }) => {
    const paymentProvider = (payload.paymentProvider || payload.paymentMethod || "CASH").toUpperCase();
    const addressObj =
      typeof payload.address === "string"
        ? {
            recipientName: payload.customerName,
            phone: payload.customerPhone,
            street: payload.address,
            city: "Toshkent",
          }
        : payload.address;

    return request<{ order: Order; paymentUrl?: string }>("/orders", {
      method: "POST",
      body: JSON.stringify({
        customerName: payload.customerName,
        customerPhone: payload.customerPhone,
        customerEmail: payload.customerEmail || undefined,
        note: payload.note || payload.notes || undefined,
        paymentProvider,
        address: addressObj,
        items: payload.items.map((it) => ({
          productVariantId: it.productVariantId || it.productId,
          quantity: it.quantity,
        })),
      }),
    });
  },
  getOrderById: (id: string) => request<Order>(`/orders/${id}`),
};
