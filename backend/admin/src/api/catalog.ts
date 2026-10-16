import { getData, getPaginated, sendData, type PaginationMeta } from './http';

// ==========================================
// Shared
// ==========================================

export const LOCALES = ['uz', 'ru', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export type LocalizedText = Record<Locale, string>;

export const emptyLocalized = (): LocalizedText => ({ uz: '', ru: '', en: '' });

/** `nameUz` → `sabo-kefir-1l` style slug (latin only, as backend slugs are used in URLs). */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[‘’ʻʼ'`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ==========================================
// Public response shapes (backend formatters)
// ==========================================

/** `CategoriesService.formatCategory` */
export interface PublicCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image: { id: string; url: string } | null;
  children?: PublicCategory[];
  sortOrder: number;
  isActive: boolean;
}

/** `ProductsService.formatPublicProduct` */
export interface PublicProduct {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  description: string | null;
  brand: string;
  isFeatured: boolean;
  category: { id: string; slug: string; name: string } | null;
  images: {
    id: string;
    url: string | null;
    type: ProductImageType;
    altText: string | null;
    isPrimary: boolean;
  }[];
  variants: {
    id: string;
    name: string;
    volume: string | null;
    unit: string | null;
    priceMinor: number | null;
    currency: string;
    isAvailable: boolean;
    isDefault: boolean;
  }[];
  availability: { status: AvailabilityStatus; stock: number | null } | null;
}

export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
export type ProductImageType = 'PRIMARY' | 'GALLERY' | 'LIFESTYLE' | 'DETAIL' | 'THUMBNAIL';
export type AvailabilityStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'COMING_SOON' | 'HIDDEN';

/** Raw Prisma product returned by admin create/publish/archive. */
export interface ProductRecord {
  id: string;
  slug: string;
  name: string;
  status: ProductStatus;
  isActive: boolean;
  isFeatured: boolean;
  categoryId: string | null;
}

export interface AdminProductVariant {
  id: string;
  name: string;
  volume: string | null;
  unit: string | null;
  sku: string | null;
  barcode: string | null;
  priceMinor: number | null;
  currency: string;
  stock: number;
  isAvailable: boolean;
  isDefault: boolean;
}

export interface AdminProductImage {
  id: string;
  mediaId: string;
  url: string;
  type: ProductImageType;
  sortOrder: number;
  altText: string | null;
  isPrimary: boolean;
}

/** Nutrition / storage as stored: every field nullable. */
type NullableFields<T> = { [K in keyof T]-?: T[K] | null };

/** `ProductsService.formatAdminProduct` — `GET /admin/products`, `PATCH /admin/products/:id`. */
export interface AdminProductResponse extends ProductRecord {
  description: string | null;
  shortDescription: string | null;
  brand: string | null;
  sortOrder: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  translations: {
    locale: string;
    name: string;
    description: string | null;
    shortDescription: string | null;
    ingredientsText: string | null;
    storageText: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
  }[];
  category: { id: string; slug: string; name: string; translations: { locale: string; name: string }[] } | null;
  images: AdminProductImage[];
  variants: AdminProductVariant[];
  nutrition: NullableFields<ProductNutritionInput> | null;
  storage: NullableFields<ProductStorageInput> | null;
  availability: { status: AvailabilityStatus; stock: number | null } | null;
}

// ==========================================
// Request DTOs (backend/src/products/dto, backend/src/categories/dto)
// ==========================================

export interface ProductTranslationInput {
  locale: Locale;
  name: string;
  description?: string;
  shortDescription?: string;
  ingredientsText?: string;
  storageText?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface ProductImageInput {
  mediaId: string;
  type?: ProductImageType;
  sortOrder?: number;
  altText?: string;
  isPrimary?: boolean;
}

export interface ProductVariantInput {
  id?: string;
  name: string;
  volume?: string;
  unit?: string;
  sku?: string;
  barcode?: string;
  priceMinor?: number;
  currency?: string;
  stock?: number;
  isAvailable?: boolean;
  isDefault?: boolean;
}

export interface ProductNutritionInput {
  servingSize?: string;
  calories?: number;
  protein?: number;
  fat?: number;
  carbohydrates?: number;
  sugar?: number;
  salt?: number;
  fiber?: number;
}

export interface ProductStorageInput {
  temperatureMin?: number;
  temperatureMax?: number;
  shelfLife?: string;
  storageText?: string;
}

/** `CreateProductDto` */
export interface CreateProductInput {
  slug: string;
  name: string;
  description?: string;
  shortDescription?: string;
  categoryId?: string;
  brand?: string;
  status?: ProductStatus;
  isFeatured?: boolean;
  isActive?: boolean;
  translations?: ProductTranslationInput[];
  images?: ProductImageInput[];
  variants?: ProductVariantInput[];
  nutrition?: ProductNutritionInput;
  storage?: ProductStorageInput;
}

/**
 * `UpdateProductDto` = `PartialType(CreateProductDto)`. When present:
 * `translations`/`images` are replaced, `variants` are upserted by `id`
 * (omitted ones are deleted), `nutrition`/`storage` are replaced.
 */
export type UpdateProductInput = Partial<CreateProductInput>;

export interface CategoryTranslationInput {
  locale: Locale;
  name: string;
  description?: string;
}

/** `CreateCategoryDto` / `UpdateCategoryDto` */
export interface CategoryInput {
  slug: string;
  name: string;
  description?: string;
  imageId?: string;
  /** `null` clears the parent on update (`@IsOptional` lets null through, Prisma sets the column to NULL). */
  parentId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
  translations?: CategoryTranslationInput[];
}

// ==========================================
// Admin view models (all three locales merged)
// ==========================================

export interface AdminCategory {
  id: string;
  slug: string;
  parentId: string | null;
  name: LocalizedText;
  description: LocalizedText;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface AdminProduct {
  id: string;
  slug: string;
  brand: string;
  status: ProductStatus;
  isActive: boolean;
  isFeatured: boolean;
  name: LocalizedText;
  description: LocalizedText;
  category: { id: string; name: string } | null;
  imageUrl: string | null;
  images: AdminProductImage[];
  /** Default variant (or first one). */
  variant: AdminProductVariant | null;
  variants: AdminProductVariant[];
  /** Sum of all variants' stock. */
  stock: number;
  nutrition: AdminProductResponse['nutrition'];
  storage: AdminProductResponse['storage'];
}

function byLocale<T>(results: readonly T[]): Record<Locale, T> {
  return { uz: results[0], ru: results[1], en: results[2] };
}

function flattenCategories(list: PublicCategory[], parentId: string | null = null): (PublicCategory & { parentId: string | null })[] {
  return list.flatMap((c) => [{ ...c, parentId }, ...flattenCategories(c.children ?? [], c.id)]);
}

/**
 * `GET /categories` is the only listing endpoint: it returns active top-level
 * categories with nested children, localized by `locale`. We request every
 * locale and merge them so the edit form can resend all translations.
 */
export async function fetchCategories(): Promise<AdminCategory[]> {
  const results = await Promise.all(LOCALES.map((locale) => getData<PublicCategory[]>('/categories', { locale })));
  const perLocale = byLocale(results.map((list) => flattenCategories(list)));
  const lookup = (locale: Locale, id: string) => perLocale[locale].find((c) => c.id === id);

  return perLocale.uz.map((c) => ({
    id: c.id,
    slug: c.slug,
    parentId: c.parentId,
    name: { uz: c.name, ru: lookup('ru', c.id)?.name ?? '', en: lookup('en', c.id)?.name ?? '' },
    description: {
      uz: c.description ?? '',
      ru: lookup('ru', c.id)?.description ?? '',
      en: lookup('en', c.id)?.description ?? '',
    },
    imageUrl: c.image?.url ?? null,
    sortOrder: c.sortOrder,
    isActive: c.isActive,
  }));
}

export const createCategory = (input: CategoryInput) => sendData<{ id: string }>('post', '/admin/categories', input);
export const updateCategory = (id: string, input: CategoryInput) =>
  sendData<{ id: string }>('patch', `/admin/categories/${id}`, input);
export const deleteCategory = (id: string) => sendData<{ success: boolean }>('delete', `/admin/categories/${id}`);

/** Backend `PaginationQueryDto` caps `limit` at 100. */
const PRODUCTS_PAGE_LIMIT = 100;

export interface ProductsPage {
  items: AdminProduct[];
  meta: PaginationMeta | null;
}

const localized = (p: AdminProductResponse, field: 'name' | 'description'): LocalizedText => {
  const pick = (locale: Locale) => p.translations.find((t) => t.locale === locale)?.[field] ?? '';
  return {
    uz: pick('uz') || (p[field] ?? ''),
    ru: pick('ru'),
    en: pick('en'),
  };
};

export function toAdminProduct(p: AdminProductResponse): AdminProduct {
  const image = p.images.find((img) => img.isPrimary) ?? p.images[0];
  return {
    id: p.id,
    slug: p.slug,
    brand: p.brand ?? 'SABO',
    status: p.status,
    isActive: p.isActive,
    isFeatured: p.isFeatured,
    name: localized(p, 'name'),
    description: localized(p, 'description'),
    category: p.category
      ? { id: p.category.id, name: p.category.translations.find((t) => t.locale === 'uz')?.name ?? p.category.name }
      : null,
    imageUrl: image?.url ?? null,
    images: p.images,
    variant: p.variants.find((v) => v.isDefault) ?? p.variants[0] ?? null,
    variants: p.variants,
    stock: p.variants.reduce((sum, v) => sum + v.stock, 0),
    nutrition: p.nutrition,
    storage: p.storage,
  };
}

/** `GET /admin/products` — every non-deleted product (DRAFT / INACTIVE / ARCHIVED included). */
export async function fetchProducts(page = 1, status?: ProductStatus): Promise<ProductsPage> {
  const result = await getPaginated<AdminProductResponse>('/admin/products', {
    page,
    limit: PRODUCTS_PAGE_LIMIT,
    ...(status ? { status } : {}),
  });
  return { items: result.items.map(toAdminProduct), meta: result.meta };
}

export const createProduct = (input: CreateProductInput) => sendData<ProductRecord>('post', '/admin/products', input);
export const updateProduct = (id: string, input: UpdateProductInput) =>
  sendData<AdminProductResponse>('patch', `/admin/products/${id}`, input);
export const publishProduct = (id: string) => sendData<ProductRecord>('post', `/admin/products/${id}/publish`);
export const archiveProduct = (id: string) => sendData<ProductRecord>('post', `/admin/products/${id}/archive`);
export const deleteProduct = (id: string) => sendData<{ success: boolean }>('delete', `/admin/products/${id}`);

/** Builds the translations array, skipping locales whose name is empty. */
export function buildTranslations(name: LocalizedText, description: LocalizedText): { locale: Locale; name: string; description?: string }[] {
  return LOCALES.filter((locale) => name[locale].trim() !== '').map((locale) => ({
    locale,
    name: name[locale].trim(),
    ...(description[locale].trim() ? { description: description[locale].trim() } : {}),
  }));
}
