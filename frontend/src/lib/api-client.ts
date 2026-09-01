import type { User, MediaFileItem, ThemeSettings } from "@/lib/types";
import type { ApiProduct } from "@/lib/product-mapper";

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

export interface AdminOrderApi {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  totalMinor: number;
  paymentStatus: string;
  status: string;
  createdAt: string;
  address?: { city?: string | null; district?: string | null; street?: string | null; apartment?: string | null } | null;
  items?: Array<{ productName: string; quantity: number }>;
  payments?: Array<{ provider: string }>;
}

export interface AdminMessageApi {
  id: string;
  name: string;
  phone?: string | null;
  message: string;
  status: string;
  createdAt: string;
}

const API_BASE =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"
    : process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

const ACCESS_TOKEN_KEY = "sabo_access_token";
const REFRESH_TOKEN_KEY = "sabo_refresh_token";

function getStoredTokens() {
  if (typeof window === "undefined") return { accessToken: null, refreshToken: null };
  return {
    accessToken: window.localStorage.getItem(ACCESS_TOKEN_KEY),
    refreshToken: window.localStorage.getItem(REFRESH_TOKEN_KEY),
  };
}

function storeTokens(accessToken: string, refreshToken: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

function clearTokens() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

let refreshPromise: Promise<boolean> | null = null;
const REQUEST_TIMEOUT_MS = 8_000;

async function tryRefreshToken(): Promise<boolean> {
  const { refreshToken } = getStoredTokens();
  if (!refreshToken) return false;

  if (!refreshPromise) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    refreshPromise = fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) return false;
        const json = await res.json();
        const tokens = json?.data;
        if (tokens?.accessToken && tokens?.refreshToken) {
          storeTokens(tokens.accessToken, tokens.refreshToken);
          return true;
        }
        return false;
      })
      .catch(() => false)
      .finally(() => {
        clearTimeout(timeout);
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function request<T>(endpoint: string, options: RequestInit = {}, _retried = false): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  try {
    const { accessToken } = getStoredTokens();
    const authHeader: Record<string, string> = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

    const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
    const headers: Record<string, string> = {
      ...authHeader,
      ...(options.headers as Record<string, string> || {}),
    };

    if (!isFormData && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    const controller = new AbortController();
    const onExternalAbort = () => controller.abort();
    if (options.signal) {
      if (options.signal.aborted) controller.abort();
      else options.signal.addEventListener("abort", onExternalAbort, { once: true });
    }
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    let res: Response;
    try {
      res = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
      options.signal?.removeEventListener("abort", onExternalAbort);
    }

    if (res.status === 401 && accessToken && !_retried) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        return request<T>(endpoint, options, true);
      }
      clearTokens();
    }

    const raw = await res.text();
    let json: (ApiResponse<T> & { message?: string }) | undefined;
    if (raw) {
      try {
        json = JSON.parse(raw) as ApiResponse<T> & { message?: string };
      } catch {
        // A proxy can return a non-JSON error page. Normalize it below.
      }
    }

    if (!res.ok) {
      if (json?.error) return json;
      return {
        success: false,
        error: {
          code: `HTTP_${res.status}`,
          message: json?.message || "Xatolik yuz berdi",
        },
      };
    }
    return json ?? { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message:
          err instanceof Error && err.name === "AbortError"
            ? "So'rov vaqti tugadi. Qayta urinib ko'ring."
            : err instanceof Error
              ? err.message
              : "Tarmoq xatosi yuz berdi",
      },
    };
  }
}

export const apiClient = {
  getHealth: () => request<{ status: string; timestamp: string }>("/health"),
  getProducts: (params?: { category?: string; q?: string; search?: string; page?: number; limit?: number; locale?: string; featured?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);
    if (params?.q || params?.search) query.set("search", params.q || params.search || "");
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());
    if (params?.locale) query.set("locale", params.locale);
    if (params?.featured !== undefined) query.set("featured", String(params.featured));
    const qs = query.toString();
    return request<ApiProduct[]>(`/products${qs ? `?${qs}` : ""}`);
  },
  getFeaturedProducts: (locale?: string) =>
    request<ApiProduct[]>(`/products/featured${locale ? `?locale=${locale}` : ""}`),
  getProductBySlug: (slug: string, locale?: string) =>
    request<ApiProduct>(`/products/${slug}${locale ? `?locale=${locale}` : ""}`),
  getCategories: (locale?: string) =>
    request<{ id: string; slug: string; name: string }[]>(`/categories${locale ? `?locale=${locale}` : ""}`),
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
  register: async (payload: { name?: string; firstName?: string; lastName?: string; phone: string; password: string; email?: string }) => {
    const parts = (payload.name || "").trim().split(" ");
    const firstName = payload.firstName || parts[0] || "Mijoz";
    const lastName = payload.lastName || parts.slice(1).join(" ") || undefined;
    const res = await request<{ user: User; accessToken: string; refreshToken: string; expiresIn: number }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        firstName,
        lastName,
        phone: payload.phone,
        email: payload.email || undefined,
        password: payload.password,
      }),
    });
    if (res.success && res.data) storeTokens(res.data.accessToken, res.data.refreshToken);
    return res;
  },
  login: async (payload: { identifier?: string; phone?: string; email?: string; password?: string }) => {
    const res = await request<{ user: User; accessToken: string; refreshToken: string; expiresIn: number }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        identifier: payload.identifier || payload.phone || payload.email || "",
        password: payload.password || "",
      }),
    });
    if (res.success && res.data) storeTokens(res.data.accessToken, res.data.refreshToken);
    return res;
  },
  logout: async () => {
    const { refreshToken } = getStoredTokens();
    const res = await request<{ success: boolean }>("/auth/logout", {
      method: "POST",
      body: JSON.stringify(refreshToken ? { refreshToken } : {}),
    });
    clearTokens();
    return res;
  },
  isAuthenticated: () => Boolean(getStoredTokens().accessToken),
  getMe: () => request<{ user: User }>("/auth/me"),
  createOrder: (payload: {
    items: Array<{ productVariantId: string; quantity: number }>;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    address: string | { recipientName?: string; phone?: string; city?: string; street?: string };
    notes?: string;
    note?: string;
    paymentProvider?: "CLICK" | "PAYME" | "CASH";
  }) => {
    const paymentProvider = payload.paymentProvider || "CASH";
    const addressObj =
      typeof payload.address === "string"
        ? {
            recipientName: payload.customerName,
            phone: payload.customerPhone,
            street: payload.address,
            city: "Toshkent",
          }
        : payload.address;

    return request<{ id: string; [key: string]: unknown }>("/orders", {
      method: "POST",
      body: JSON.stringify({
        customerName: payload.customerName,
        customerPhone: payload.customerPhone,
        customerEmail: payload.customerEmail || undefined,
        note: payload.note || payload.notes || undefined,
        paymentProvider,
        address: addressObj,
        items: payload.items.map((it) => ({
          productVariantId: it.productVariantId,
          quantity: it.quantity,
        })),
      }),
    });
  },
  getOrderById: (id: string) => request<{ id: string; [key: string]: unknown }>(`/orders/${id}`),
  getCheckoutUrl: (orderId: string, provider: "CLICK" | "PAYME", returnUrl?: string) =>
    request<{ paymentUrl: string }>("/payments/checkout-url", {
      method: "POST",
      body: JSON.stringify({ orderId, provider, returnUrl }),
    }),

  // ==========================================
  // MEDIA UPLOAD & DOWNLOAD
  // ==========================================
  uploadMedia: (file: File | Blob, folder = "general", altText = "") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    if (altText) formData.append("altText", altText);

    return request<MediaFileItem>("/media/upload", {
      method: "POST",
      body: formData,
    });
  },
  listMedia: (folder?: string, page = 1, limit = 50) => {
    const query = new URLSearchParams();
    if (folder && folder !== "all") query.set("folder", folder);
    query.set("page", page.toString());
    query.set("limit", limit.toString());
    return request<MediaFileItem[]>(`/media?${query.toString()}`);
  },
  getMedia: (id: string) => request<MediaFileItem>(`/media/${id}`),
  deleteMedia: (id: string) => request<{ success: boolean; message: string }>(`/media/${id}`, { method: "DELETE" }),
  getMediaDownloadUrl: (id: string) => `${API_BASE}/media/download/${id}`,

  // ==========================================
  // PRODUCT MANAGEMENT (ADMIN)
  // ==========================================
  createProduct: (product: Record<string, unknown>) =>
    request<ApiProduct>("/admin/products", {
      method: "POST",
      body: JSON.stringify(product),
    }),
  updateProduct: (id: string, product: Record<string, unknown>) =>
    request<ApiProduct>(`/admin/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(product),
    }),
  deleteProduct: (id: string) =>
    request<{ success: boolean; message: string }>(`/admin/products/${id}`, {
      method: "DELETE",
    }),
  getAdminOrders: () => request<AdminOrderApi[]>("/admin/orders"),
  updateAdminOrderStatus: (id: string, status: string) =>
    request<AdminOrderApi>(`/admin/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  getAdminMessages: () => request<AdminMessageApi[]>("/admin/messages"),
  updateAdminMessageStatus: (id: string, status: string) =>
    request<AdminMessageApi>(`/admin/messages/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  // ==========================================
  // GLOBAL THEME & COLOR SETTINGS
  // ==========================================
  getThemeSettings: () => request<ThemeSettings>("/settings/theme"),
  updateThemeSettings: (settings: Partial<ThemeSettings>) =>
    request<ThemeSettings>("/settings/theme", {
      method: "PUT",
      body: JSON.stringify(settings),
    }),
  resetThemeSettings: () => request<ThemeSettings>("/settings/theme", { method: "DELETE" }),
};
