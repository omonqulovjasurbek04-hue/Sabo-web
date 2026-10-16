import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Archive, Pencil, Plus, Search, Send, Star, Trash2, Package, X } from 'lucide-react';
import {
  LOCALES,
  archiveProduct,
  buildTranslations,
  createProduct,
  deleteProduct,
  emptyLocalized,
  fetchCategories,
  fetchProducts,
  publishProduct,
  slugify,
  updateProduct,
  type AdminCategory,
  type AdminProduct,
  type CreateProductInput,
  type LocalizedText,
  type ProductImageInput,
  type ProductNutritionInput,
  type ProductStatus,
  type ProductStorageInput,
  type ProductVariantInput,
  type UpdateProductInput,
} from '../../api/catalog';
import { getApiErrorMessage, resolveMediaUrl, type PaginationMeta } from '../../api/http';
import { uploadMedia } from '../../api/media';
import { EmptyState, ErrorState, InlineAlert, LoadingState } from '../../components/ui/AsyncState';
import { useAuth } from '../../context/useAuth';

/** Backend stores prices in minor units: 1 UZS = 100 minor (see frontend `product-mapper.ts`). */
const MINOR_PER_UZS = 100;

const formatPrice = (priceMinor: number | null, currency: string) =>
  priceMinor == null ? '—' : `${(priceMinor / MINOR_PER_UZS).toLocaleString('uz-UZ')} ${currency}`;

const STATUS_META: Record<ProductStatus, { label: string; className: string }> = {
  ACTIVE: { label: 'Nashr qilingan', className: 'bg-emerald-50 text-emerald-700' },
  DRAFT: { label: 'Qoralama', className: 'bg-slate-100 text-slate-700' },
  INACTIVE: { label: 'Nofaol', className: 'bg-orange-50 text-orange-700' },
  ARCHIVED: { label: 'Arxivlangan', className: 'bg-amber-50 text-amber-800' },
};
const STATUSES = Object.keys(STATUS_META) as ProductStatus[];

interface VariantRow {
  /** Set for variants that already exist (PATCH upserts by id and deletes the ones left out). */
  id?: string;
  name: string;
  volume: string;
  unit: string;
  sku: string;
  priceUzs: number;
  stock: number;
  isAvailable: boolean;
  isDefault: boolean;
}

interface ProductForm {
  name: LocalizedText;
  description: LocalizedText;
  slug: string;
  categoryId: string;
  isFeatured: boolean;
  variants: VariantRow[];
  fatPercent: string;
  shelfLife: string;
  /** Create only — existing products use the row publish / archive buttons. */
  publishNow: boolean;
  image: File | null;
}

const emptyVariant = (isDefault: boolean): VariantRow => ({
  name: '1 L',
  volume: '1',
  unit: 'L',
  sku: '',
  priceUzs: 0,
  stock: 0,
  isAvailable: true,
  isDefault,
});

const emptyForm = (): ProductForm => ({
  name: emptyLocalized(),
  description: emptyLocalized(),
  slug: '',
  categoryId: '',
  isFeatured: false,
  variants: [emptyVariant(true)],
  fatPercent: '',
  shelfLife: '',
  publishNow: true,
  image: null,
});

const toEditForm = (p: AdminProduct): ProductForm => ({
  ...emptyForm(),
  name: { ...p.name },
  description: { ...p.description },
  slug: p.slug,
  categoryId: p.category?.id ?? '',
  isFeatured: p.isFeatured,
  variants: p.variants.map((v) => ({
    id: v.id,
    name: v.name,
    volume: v.volume ?? '',
    unit: v.unit ?? '',
    sku: v.sku ?? '',
    priceUzs: v.priceMinor == null ? 0 : v.priceMinor / MINOR_PER_UZS,
    stock: v.stock,
    isAvailable: v.isAvailable,
    isDefault: v.isDefault,
  })),
  fatPercent: p.nutrition?.fat != null ? String(p.nutrition.fat) : '',
  shelfLife: p.storage?.shelfLife ?? '',
});

const toVariantInput = (v: VariantRow): ProductVariantInput => ({
  ...(v.id ? { id: v.id } : {}),
  name: v.name.trim(),
  ...(v.volume.trim() ? { volume: v.volume.trim() } : {}),
  ...(v.unit.trim() ? { unit: v.unit.trim() } : {}),
  ...(v.sku.trim() ? { sku: v.sku.trim() } : {}),
  priceMinor: Math.round(v.priceUzs * MINOR_PER_UZS),
  currency: 'UZS',
  stock: Math.trunc(v.stock),
  isAvailable: v.isAvailable,
  isDefault: v.isDefault,
});

/** Drops `null`s so a stored nutrition / storage row can be resent as a DTO. */
function withoutNulls<T extends object>(value: { [K in keyof T]: T[K] | null }): Partial<T> {
  return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== null)) as Partial<T>;
}

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl border border-[#EBE3DA] bg-[#FDFBF7] text-xs font-semibold focus:outline-none focus:border-[#0E3B2E]';
const labelClass = 'block font-bold text-[#52796F] mb-1';

export const ProductsList: React.FC = () => {
  const { user } = useAuth();
  const canManage = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';
  const canEdit = canManage || user?.role === 'EDITOR';

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'all'>('all');

  const [editing, setEditing] = useState<AdminProduct | 'new' | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async (targetPage: number, status: ProductStatus | 'all') => {
    setLoading(true);
    setLoadError(null);
    try {
      const [productPage, categoryList] = await Promise.all([
        fetchProducts(targetPage, status === 'all' ? undefined : status),
        fetchCategories(),
      ]);
      setProducts(productPage.items);
      setMeta(productPage.meta);
      setCategories(categoryList);
    } catch (err) {
      setProducts([]);
      setMeta(null);
      setLoadError(getApiErrorMessage(err, 'Mahsulotlarni yuklab bo‘lmadi.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(page, statusFilter);
  }, [load, page, statusFilter]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch =
        !q || LOCALES.some((l) => p.name[l].toLowerCase().includes(q)) || p.slug.toLowerCase().includes(q);
      const matchesCategory = selectedCategory === 'all' || p.category?.id === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const openCreate = () => {
    setForm(emptyForm());
    setSlugTouched(false);
    setFormError(null);
    setEditing('new');
  };

  const openEdit = (p: AdminProduct) => {
    setForm(toEditForm(p));
    setSlugTouched(true);
    setFormError(null);
    setEditing(p);
  };

  const setName = (locale: keyof LocalizedText, value: string) => {
    setForm((f) => ({
      ...f,
      name: { ...f.name, [locale]: value },
      slug: locale === 'uz' && !slugTouched ? slugify(value) : f.slug,
    }));
  };

  const setVariant = (index: number, patch: Partial<VariantRow>) => {
    setForm((f) => ({
      ...f,
      variants: f.variants.map((v, i) => {
        if (i === index) return { ...v, ...patch };
        // Only one default variant.
        return patch.isDefault ? { ...v, isDefault: false } : v;
      }),
    }));
  };

  const addVariant = () =>
    setForm((f) => ({ ...f, variants: [...f.variants, emptyVariant(f.variants.length === 0)] }));

  const removeVariant = (index: number) =>
    setForm((f) => {
      const variants = f.variants.filter((_, i) => i !== index);
      if (variants.length > 0 && !variants.some((v) => v.isDefault)) variants[0] = { ...variants[0], isDefault: true };
      return { ...f, variants };
    });

  /** Uploads the selected file; returns the new image list (new primary + existing non-primary images). */
  const buildImages = async (existing: AdminProduct | null): Promise<ProductImageInput[] | undefined> => {
    if (!form.image) return undefined;
    const media = await uploadMedia({ file: form.image, folder: 'products', altText: form.name.uz.trim() });
    const kept: ProductImageInput[] = (existing?.images ?? [])
      .filter((img) => !img.isPrimary)
      .map((img) => ({
        mediaId: img.mediaId,
        type: img.type,
        sortOrder: img.sortOrder + 1,
        ...(img.altText ? { altText: img.altText } : {}),
        isPrimary: false,
      }));
    return [{ mediaId: media.id, type: 'PRIMARY', sortOrder: 0, isPrimary: true, altText: form.name.uz.trim() }, ...kept];
  };

  /** PATCH replaces nutrition / storage, so fields this form does not edit are resent as stored. */
  const buildNutrition = (existing: AdminProduct | null): ProductNutritionInput | undefined => {
    const fat = form.fatPercent.trim() ? Number(form.fatPercent.replace(',', '.')) : NaN;
    const stored = existing?.nutrition ? withoutNulls<ProductNutritionInput>(existing.nutrition) : null;
    if (Number.isFinite(fat)) return { servingSize: '100 g', ...stored, fat };
    if (stored?.fat !== undefined) return { ...stored, fat: undefined };
    return undefined;
  };

  const buildStorage = (existing: AdminProduct | null): ProductStorageInput | undefined => {
    const shelfLife = form.shelfLife.trim();
    const stored = existing?.storage ? withoutNulls<ProductStorageInput>(existing.storage) : null;
    if (shelfLife) return { ...stored, shelfLife };
    if (stored?.shelfLife !== undefined) return { ...stored, shelfLife: undefined };
    return undefined;
  };

  const buildInput = async (existing: AdminProduct | null): Promise<CreateProductInput> => {
    const images = await buildImages(existing);
    const nutrition = buildNutrition(existing);
    const storage = buildStorage(existing);
    return {
      slug: form.slug.trim(),
      name: form.name.uz.trim(),
      ...(form.description.uz.trim() ? { description: form.description.uz.trim() } : {}),
      ...(form.categoryId ? { categoryId: form.categoryId } : {}),
      isFeatured: form.isFeatured,
      translations: buildTranslations(form.name, form.description),
      variants: form.variants.map(toVariantInput),
      ...(nutrition ? { nutrition } : {}),
      ...(storage ? { storage } : {}),
      ...(images ? { images } : {}),
    };
  };

  const buildCreateInput = async (): Promise<CreateProductInput> => ({
    ...(await buildInput(null)),
    status: form.publishNow ? 'ACTIVE' : 'DRAFT',
    isActive: true,
  });

  const buildUpdateInput = (existing: AdminProduct): Promise<UpdateProductInput> => buildInput(existing);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (form.variants.length === 0) {
      setFormError('Kamida bitta variant (narx bilan) kerak.');
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      if (editing === 'new') {
        const created = await createProduct(await buildCreateInput());
        setNotice(
          created.status === 'ACTIVE'
            ? `“${created.name}” katalogga qo‘shildi.`
            : `“${created.name}” qoralama sifatida saqlandi. Nashr qilmaguncha saytda ko‘rinmaydi.`,
        );
      } else {
        await updateProduct(editing.id, await buildUpdateInput(editing));
        setNotice('O‘zgarishlar saqlandi.');
      }
      setEditing(null);
      await load(page, statusFilter);
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'Mahsulotni saqlab bo‘lmadi.'));
    } finally {
      setSaving(false);
    }
  };

  const runAction = async (id: string, action: () => Promise<unknown>, success: string, fallback: string) => {
    setBusyId(id);
    setActionError(null);
    setNotice(null);
    try {
      await action();
      setNotice(success);
      await load(page, statusFilter);
    } catch (err) {
      setActionError(getApiErrorMessage(err, fallback));
    } finally {
      setBusyId(null);
    }
  };

  const handlePublish = (p: AdminProduct) => {
    void runAction(p.id, () => publishProduct(p.id), `“${p.name.uz}” nashr qilindi.`, 'Mahsulotni nashr qilib bo‘lmadi.');
  };

  const handleArchive = (p: AdminProduct) => {
    if (!confirm(`“${p.name.uz}” arxivlansinmi? Mahsulot saytdan yashiriladi.`)) return;
    void runAction(p.id, () => archiveProduct(p.id), `“${p.name.uz}” arxivlandi.`, 'Mahsulotni arxivlab bo‘lmadi.');
  };

  const handleDelete = (p: AdminProduct) => {
    if (!confirm(`“${p.name.uz}” o‘chirilsinmi? Mahsulot saytdan olib tashlanadi.`)) return;
    void runAction(p.id, () => deleteProduct(p.id), `“${p.name.uz}” o‘chirildi.`, 'Mahsulotni o‘chirib bo‘lmadi.');
  };

  const isCreate = editing === 'new';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0E3B2E] tracking-tight">Mahsulotlar</h1>
          <p className="text-sm text-[#52796F] font-medium mt-1">
            Barcha SABO mahsulotlari: nashr qilingan, qoralama, nofaol va arxivlangan.
          </p>
        </div>
        {canManage && (
          <button
            onClick={openCreate}
            className="px-5 py-2.5 rounded-xl bg-[#0E3B2E] text-white font-bold text-xs shadow-md hover:bg-[#08281F] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Yangi mahsulot qo‘shish</span>
          </button>
        )}
      </div>

      {notice && <InlineAlert tone="success" message={notice} onClose={() => setNotice(null)} />}
      {actionError && <InlineAlert tone="error" message={actionError} onClose={() => setActionError(null)} />}

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#52796F]" />
          <input
            type="text"
            placeholder="Mahsulot nomi yoki slug bo‘yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EBE3DA] bg-white text-xs font-semibold text-[#1A2E26] focus:outline-none focus:border-[#0E3B2E]"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-[#EBE3DA] bg-white text-xs font-bold text-[#1A2E26] focus:outline-none focus:border-[#0E3B2E] cursor-pointer"
        >
          <option value="all">Barcha toifalar</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name.uz}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value as ProductStatus | 'all');
          }}
          className="px-4 py-2.5 rounded-xl border border-[#EBE3DA] bg-white text-xs font-bold text-[#1A2E26] focus:outline-none focus:border-[#0E3B2E] cursor-pointer"
        >
          <option value="all">Barcha holatlar</option>
          {STATUSES.map((st) => (
            <option key={st} value={st}>
              {STATUS_META[st].label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="p-6 rounded-3xl bg-white border border-[#EBE3DA] shadow-xs overflow-x-auto">
        {loading ? (
          <LoadingState />
        ) : loadError ? (
          <ErrorState message={loadError} onRetry={() => void load(page, statusFilter)} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title={products.length === 0 ? 'Mahsulot topilmadi' : 'Filtrga mos mahsulot topilmadi'}
            hint={products.length === 0 && canManage ? '“Yangi mahsulot qo‘shish” orqali birinchi mahsulotni yarating.' : undefined}
          />
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#EBE3DA] text-[#52796F] uppercase font-extrabold tracking-wider">
                <th className="py-3 px-4">Mahsulot</th>
                <th className="py-3 px-4">Kategoriya</th>
                <th className="py-3 px-4">Variant</th>
                <th className="py-3 px-4">Narxi</th>
                <th className="py-3 px-4">Omborda</th>
                <th className="py-3 px-4">Holat</th>
                <th className="py-3 px-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE3DA]/60">
              {filtered.map((prod) => {
                const imageUrl = resolveMediaUrl(prod.imageUrl);
                return (
                  <tr key={prod.id} className="hover:bg-[#F8F6F0] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {imageUrl ? (
                          <img src={imageUrl} alt="" className="size-10 rounded-xl object-cover border border-[#EBE3DA]" />
                        ) : (
                          <div className="size-10 rounded-xl bg-[#F8F6F0] border border-[#EBE3DA] flex items-center justify-center">
                            <Package className="size-5 text-[#2D6A4F]" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-[#1A2E26] text-sm">{prod.name.uz}</div>
                          <div className="text-[11px] text-[#52796F] font-mono">{prod.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {prod.category ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#EBF7EE] text-[#0E3B2E] uppercase">
                          {prod.category.name}
                        </span>
                      ) : (
                        <span className="text-[#52796F]">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[#52796F] font-semibold">
                      {prod.variant?.name ?? '—'}
                      {prod.variants.length > 1 && <span className="ml-1 text-[10px]">(+{prod.variants.length - 1})</span>}
                    </td>
                    <td className="py-3.5 px-4 font-black text-[#0E3B2E]">
                      {prod.variant ? formatPrice(prod.variant.priceMinor, prod.variant.currency) : '—'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#1A2E26]">
                      {prod.variants.length > 0 ? `${prod.stock} dona` : '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${STATUS_META[prod.status].className}`}
                        >
                          {STATUS_META[prod.status].label}
                        </span>
                        {!prod.isActive && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700">
                            Faolsizlantirilgan
                          </span>
                        )}
                        {prod.isFeatured && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700">
                            <Star className="size-3" />
                            Tavsiya
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1">
                      {canEdit && (
                        <button
                          onClick={() => openEdit(prod)}
                          disabled={busyId === prod.id}
                          className="p-1.5 rounded-lg text-[#52796F] hover:text-[#0E3B2E] hover:bg-white transition-colors cursor-pointer disabled:opacity-50"
                          aria-label="Tahrirlash"
                          title="Tahrirlash"
                        >
                          <Pencil className="size-4" />
                        </button>
                      )}
                      {canManage && (
                        <>
                          {prod.status !== 'ACTIVE' && (
                            <button
                              onClick={() => handlePublish(prod)}
                              disabled={busyId === prod.id}
                              className="p-1.5 rounded-lg text-[#52796F] hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer disabled:opacity-50"
                              aria-label="Nashr qilish"
                              title="Nashr qilish"
                            >
                              <Send className="size-4" />
                            </button>
                          )}
                          {prod.status !== 'ARCHIVED' && (
                            <button
                              onClick={() => handleArchive(prod)}
                              disabled={busyId === prod.id}
                              className="p-1.5 rounded-lg text-[#52796F] hover:text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer disabled:opacity-50"
                              aria-label="Arxivlash"
                              title="Arxivlash"
                            >
                              <Archive className="size-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(prod)}
                            disabled={busyId === prod.id}
                            className="p-1.5 rounded-lg text-[#52796F] hover:text-[#E63946] hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                            aria-label="O‘chirish"
                            title="O‘chirish"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {meta && meta.totalPages > 1 && !loading && !loadError && (
          <div className="flex items-center justify-end gap-2 pt-4 text-xs font-bold text-[#52796F]">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={!meta.hasPrevious}
              className="px-3 py-1.5 rounded-lg border border-[#EBE3DA] disabled:opacity-40 cursor-pointer"
            >
              Oldingi
            </button>
            <span>
              {meta.page} / {meta.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!meta.hasNext}
              className="px-3 py-1.5 rounded-lg border border-[#EBE3DA] disabled:opacity-40 cursor-pointer"
            >
              Keyingi
            </button>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#EBE3DA] shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EBE3DA]">
              <h2 className="text-xl font-black text-[#0E3B2E]">{isCreate ? 'Yangi mahsulot qo‘shish' : 'Mahsulotni tahrirlash'}</h2>
              <button onClick={() => setEditing(null)} className="text-[#52796F] hover:text-[#1A2E26] cursor-pointer" aria-label="Yopish">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {formError && <InlineAlert tone="error" message={formError} />}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {LOCALES.map((locale) => (
                  <div key={locale}>
                    <label className={labelClass}>Nomi ({locale.toUpperCase()})</label>
                    <input
                      type="text"
                      required={locale === 'uz'}
                      placeholder={locale === 'uz' ? 'SABO Qatiq 3.2%' : undefined}
                      value={form.name[locale]}
                      onChange={(e) => setName(locale, e.target.value)}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {LOCALES.map((locale) => (
                  <div key={locale}>
                    <label className={labelClass}>Tavsif ({locale.toUpperCase()})</label>
                    <textarea
                      rows={3}
                      value={form.description[locale]}
                      onChange={(e) => setForm((f) => ({ ...f, description: { ...f.description, [locale]: e.target.value } }))}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Slug</label>
                  <input
                    type="text"
                    required
                    pattern="[a-z0-9]+(-[a-z0-9]+)*"
                    title="Faqat kichik lotin harflari, raqamlar va chiziqcha"
                    value={form.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setForm((f) => ({ ...f, slug: e.target.value }));
                    }}
                    className={`${inputClass} font-mono`}
                  />
                </div>
                <div>
                  <label className={labelClass}>Kategoriya</label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                    className={inputClass}
                  >
                    <option value="">— Tanlanmagan —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name.uz}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Variants & prices */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#52796F]">Variantlar va narxlar</span>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="px-3 py-1.5 rounded-lg border border-[#EBE3DA] text-[#0E3B2E] font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                    Variant qo‘shish
                  </button>
                </div>
                {form.variants.length === 0 && <InlineAlert tone="error" message="Kamida bitta variant kerak." />}
                {form.variants.map((v, index) => (
                  <div
                    key={v.id ?? `new-${index}`}
                    className="p-3 rounded-2xl border border-[#EBE3DA] bg-[#FDFBF7] grid grid-cols-2 sm:grid-cols-4 gap-2"
                  >
                    <div>
                      <label className={labelClass}>Nomi</label>
                      <input
                        type="text"
                        required
                        value={v.name}
                        onChange={(e) => setVariant(index, { name: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Hajm</label>
                      <input
                        type="text"
                        placeholder="1"
                        value={v.volume}
                        onChange={(e) => setVariant(index, { volume: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>O‘lchov birligi</label>
                      <input
                        type="text"
                        placeholder="L / g"
                        value={v.unit}
                        onChange={(e) => setVariant(index, { unit: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>SKU</label>
                      <input
                        type="text"
                        value={v.sku}
                        onChange={(e) => setVariant(index, { sku: e.target.value })}
                        className={`${inputClass} font-mono`}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Narxi (UZS)</label>
                      <input
                        type="number"
                        min={0}
                        step={100}
                        required
                        value={v.priceUzs}
                        onChange={(e) => setVariant(index, { priceUzs: Number(e.target.value) })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Ombor miqdori</label>
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={v.stock}
                        onChange={(e) => setVariant(index, { stock: Number(e.target.value) })}
                        className={inputClass}
                      />
                    </div>
                    <label className="flex items-center gap-2 font-bold text-[#1A2E26] cursor-pointer self-end pb-2.5">
                      <input
                        type="checkbox"
                        checked={v.isAvailable}
                        onChange={(e) => setVariant(index, { isAvailable: e.target.checked })}
                      />
                      Sotuvda
                    </label>
                    <div className="flex items-center justify-between gap-2 self-end pb-1.5">
                      <label className="flex items-center gap-2 font-bold text-[#1A2E26] cursor-pointer">
                        <input
                          type="radio"
                          name="defaultVariant"
                          checked={v.isDefault}
                          onChange={() => setVariant(index, { isDefault: true })}
                        />
                        Asosiy
                      </label>
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="p-1.5 rounded-lg text-[#52796F] hover:text-[#E63946] hover:bg-red-50 cursor-pointer"
                        aria-label="Variantni o‘chirish"
                        title="Variantni o‘chirish"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>Yog‘lilik (%)</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]+([.,][0-9]+)?"
                    placeholder="3.2"
                    value={form.fatPercent}
                    onChange={(e) => setForm((f) => ({ ...f, fatPercent: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Saqlash muddati</label>
                  <input
                    type="text"
                    placeholder="7 kun"
                    value={form.shelfLife}
                    onChange={(e) => setForm((f) => ({ ...f, shelfLife: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>{isCreate ? 'Asosiy rasm (ixtiyoriy)' : 'Asosiy rasmni almashtirish'}</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setForm((f) => ({ ...f, image: e.target.files?.[0] ?? null }))}
                    className="block w-full text-xs text-[#52796F]"
                  />
                </div>
              </div>

              {isCreate && (
                <label className="flex items-center gap-2 font-bold text-[#1A2E26] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.publishNow}
                    onChange={(e) => setForm((f) => ({ ...f, publishNow: e.target.checked }))}
                  />
                  Darhol nashr qilish (aks holda qoralama sifatida saqlanadi)
                </label>
              )}

              <label className="flex items-center gap-2 font-bold text-[#1A2E26] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                />
                Tavsiya etilgan (bosh sahifada)
              </label>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#EBE3DA]">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#EBE3DA] text-[#52796F] font-bold cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#0E3B2E] text-white font-bold shadow-md hover:bg-[#08281F] disabled:opacity-60 cursor-pointer"
                >
                  {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
