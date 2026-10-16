import { isAxiosError } from 'axios';
import { apiClient } from './client';

/** Backend `ResponseInterceptor` envelope. */
export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface Paginated<T> {
  items: T[];
  meta: PaginationMeta | null;
}

export async function getData<T>(url: string, params?: Record<string, string | number | boolean>): Promise<T> {
  const res = await apiClient.get<ApiEnvelope<T>>(url, { params });
  return res.data.data;
}

export async function getPaginated<T>(
  url: string,
  params?: Record<string, string | number | boolean>,
): Promise<Paginated<T>> {
  const res = await apiClient.get<ApiEnvelope<T[]>>(url, { params });
  return { items: res.data.data, meta: res.data.meta ?? null };
}

export async function sendData<T>(
  method: 'post' | 'put' | 'patch' | 'delete',
  url: string,
  body?: unknown,
): Promise<T> {
  const res = await apiClient.request<ApiEnvelope<T>>({ method, url, data: body });
  return res.data.data;
}

/** Backend `HttpExceptionFilter` error body. */
interface ApiErrorBody {
  success: false;
  error?: { code?: string; message?: string; details?: unknown };
}

const ERROR_CODE_MESSAGES: Record<string, string> = {
  PRODUCT_SLUG_EXISTS: 'Bu slug bilan mahsulot allaqachon mavjud.',
  CATEGORY_SLUG_EXISTS: 'Bu slug bilan kategoriya allaqachon mavjud.',
  MEDIA_IN_USE: 'Fayl mahsulot, blog yoki sertifikatda ishlatilmoqda — avval bog‘lanishni olib tashlang.',
  MEDIA_TYPE_NOT_ALLOWED: 'Bu fayl turi ruxsat etilmagan.',
  MEDIA_SIZE_EXCEEDED: 'Fayl hajmi ruxsat etilgan chegaradan katta.',
};

function validationDetails(details: unknown): string | null {
  if (!Array.isArray(details)) return null;
  const messages = details.filter((d): d is string => typeof d === 'string');
  return messages.length > 0 ? messages.join(', ') : null;
}

/** Human readable (uz) error message from an axios / unknown error. */
export function getApiErrorMessage(error: unknown, fallback = 'So‘rov bajarilmadi'): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    const status = error.response?.status;
    if (status === 401) return 'Sessiya tugagan — qaytadan tizimga kiring.';
    if (status === 403) return 'Bu amal uchun ruxsatingiz yo‘q.';
    const apiError = error.response?.data?.error;
    const known = apiError?.code ? ERROR_CODE_MESSAGES[apiError.code] : undefined;
    if (known) return known;
    const message = validationDetails(apiError?.details) ?? apiError?.message;
    if (message) return message;
    if (!error.response) return 'Server bilan aloqa yo‘q. Backend ishga tushganini tekshiring.';
  }
  return fallback;
}

const apiOrigin = (() => {
  try {
    return new URL(apiClient.defaults.baseURL ?? '').origin;
  } catch {
    return '';
  }
})();

/** Media URLs saved on local disk are relative (`/api/v1/media/file/...`); resolve them against the API host. */
export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${apiOrigin}${url.startsWith('/') ? '' : '/'}${url}`;
}
