import React, { useCallback, useEffect, useState } from 'react';
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react';
import {
  LOCALES,
  createCategory,
  deleteCategory,
  emptyLocalized,
  fetchCategories,
  slugify,
  updateCategory,
  type AdminCategory,
  type CategoryInput,
  type LocalizedText,
} from '../../api/catalog';
import { getApiErrorMessage, resolveMediaUrl } from '../../api/http';
import { EmptyState, ErrorState, InlineAlert, LoadingState } from '../../components/ui/AsyncState';
import { useAuth } from '../../context/useAuth';

interface CategoryForm {
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  parentId: string;
  sortOrder: number;
  isActive: boolean;
}

const emptyForm = (): CategoryForm => ({
  slug: '',
  name: emptyLocalized(),
  description: emptyLocalized(),
  parentId: '',
  sortOrder: 0,
  isActive: true,
});

const toForm = (c: AdminCategory): CategoryForm => ({
  slug: c.slug,
  name: { ...c.name },
  description: { ...c.description },
  parentId: c.parentId ?? '',
  sortOrder: c.sortOrder,
  isActive: c.isActive,
});

function toInput(form: CategoryForm, isUpdate: boolean): CategoryInput {
  const translations = LOCALES.filter((l) => form.name[l].trim()).map((locale) => ({
    locale,
    name: form.name[locale].trim(),
    ...(form.description[locale].trim() ? { description: form.description[locale].trim() } : {}),
  }));
  return {
    slug: form.slug.trim(),
    name: form.name.uz.trim(),
    ...(form.description.uz.trim() ? { description: form.description.uz.trim() } : {}),
    ...(form.parentId ? { parentId: form.parentId } : isUpdate ? { parentId: null } : {}),
    sortOrder: form.sortOrder,
    isActive: form.isActive,
    translations,
  };
}

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl border border-[#EBE3DA] bg-[#FDFBF7] text-xs font-semibold focus:outline-none focus:border-[#0E3B2E]';

export const CategoriesPage: React.FC = () => {
  const { user } = useAuth();
  const canManage = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';

  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [editing, setEditing] = useState<AdminCategory | 'new' | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setCategories(await fetchCategories());
    } catch (err) {
      setCategories([]);
      setLoadError(getApiErrorMessage(err, 'Kategoriyalarni yuklab bo‘lmadi.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openCreate = () => {
    setForm(emptyForm());
    setSlugTouched(false);
    setFormError(null);
    setEditing('new');
  };

  const openEdit = (c: AdminCategory) => {
    setForm(toForm(c));
    setSlugTouched(true);
    setFormError(null);
    setEditing(c);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setFormError(null);
    try {
      const input = toInput(form, editing !== 'new');
      if (editing === 'new') {
        await createCategory(input);
      } else {
        await updateCategory(editing.id, input);
      }
      setEditing(null);
      await load();
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'Kategoriyani saqlab bo‘lmadi.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c: AdminCategory) => {
    if (!confirm(`“${c.name.uz}” kategoriyasini o‘chirmoqchimisiz? Bu amalni qaytarib bo‘lmaydi.`)) return;
    setActionError(null);
    try {
      await deleteCategory(c.id);
      await load();
    } catch (err) {
      setActionError(getApiErrorMessage(err, 'Kategoriyani o‘chirib bo‘lmadi.'));
    }
  };

  const setName = (locale: keyof LocalizedText, value: string) => {
    setForm((f) => ({
      ...f,
      name: { ...f.name, [locale]: value },
      slug: locale === 'uz' && !slugTouched ? slugify(value) : f.slug,
    }));
  };

  const parentName = (id: string | null) => (id ? categories.find((c) => c.id === id)?.name.uz : undefined);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0E3B2E] tracking-tight">Kategoriyalar</h1>
          <p className="text-sm text-[#52796F] font-medium mt-1">
            Mahsulot toifalari (UZ / RU / EN). Ro‘yxatda faqat faol kategoriyalar ko‘rinadi.
          </p>
        </div>
        {canManage && (
          <button
            onClick={openCreate}
            className="px-5 py-2.5 rounded-xl bg-[#0E3B2E] text-white font-bold text-xs shadow-md hover:bg-[#08281F] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Yangi kategoriya</span>
          </button>
        )}
      </div>

      {actionError && <InlineAlert tone="error" message={actionError} onClose={() => setActionError(null)} />}

      {loading ? (
        <LoadingState />
      ) : loadError ? (
        <ErrorState message={loadError} onRetry={load} />
      ) : categories.length === 0 ? (
        <EmptyState title="Kategoriyalar hali yo‘q" hint={canManage ? '“Yangi kategoriya” tugmasi orqali birinchisini qo‘shing.' : undefined} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c) => {
            const imageUrl = resolveMediaUrl(c.imageUrl);
            return (
              <div
                key={c.id}
                className="p-6 rounded-3xl bg-white border border-[#EBE3DA] shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    {imageUrl ? (
                      <img src={imageUrl} alt="" className="size-12 rounded-2xl object-cover border border-[#EBE3DA]" />
                    ) : (
                      <div className="size-12 rounded-2xl bg-[#EBF7EE] text-[#0E3B2E] flex items-center justify-center font-black text-lg">
                        {c.name.uz.charAt(0)}
                      </div>
                    )}
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">
                      <Check className="size-3" />
                      Faol
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-[#0E3B2E]">{c.name.uz}</h2>
                  <p className="text-[11px] text-[#52796F] mt-0.5">
                    {c.name.ru || '—'} · {c.name.en || '—'}
                  </p>
                  <p className="text-xs text-[#52796F] font-mono mt-1">slug: {c.slug}</p>
                  {parentName(c.parentId) && (
                    <p className="text-xs text-[#52796F] mt-1">Ota kategoriya: {parentName(c.parentId)}</p>
                  )}
                  {c.description.uz && <p className="text-xs text-[#52796F] mt-2 leading-relaxed">{c.description.uz}</p>}
                </div>

                <div className="pt-6 mt-6 border-t border-[#EBE3DA] flex items-center justify-between text-xs">
                  <span className="text-[#52796F] font-semibold">Tartib: {c.sortOrder}</span>
                  {canManage && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(c)}
                        className="p-1.5 rounded-lg text-[#52796F] hover:text-[#0E3B2E] hover:bg-[#F8F6F0] cursor-pointer"
                        aria-label="Tahrirlash"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c)}
                        className="p-1.5 rounded-lg text-[#52796F] hover:text-[#E63946] hover:bg-red-50 cursor-pointer"
                        aria-label="O‘chirish"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#EBE3DA] shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EBE3DA]">
              <h2 className="text-xl font-black text-[#0E3B2E]">
                {editing === 'new' ? 'Yangi kategoriya' : 'Kategoriyani tahrirlash'}
              </h2>
              <button onClick={() => setEditing(null)} className="text-[#52796F] hover:text-[#1A2E26] cursor-pointer" aria-label="Yopish">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {formError && <InlineAlert tone="error" message={formError} />}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {LOCALES.map((locale) => (
                  <div key={locale}>
                    <label className="block font-bold text-[#52796F] mb-1">Nomi ({locale.toUpperCase()})</label>
                    <input
                      type="text"
                      required={locale === 'uz'}
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
                    <label className="block font-bold text-[#52796F] mb-1">Tavsif ({locale.toUpperCase()})</label>
                    <textarea
                      rows={3}
                      value={form.description[locale]}
                      onChange={(e) => setForm((f) => ({ ...f, description: { ...f.description, [locale]: e.target.value } }))}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#52796F] mb-1">Slug</label>
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
                  <label className="block font-bold text-[#52796F] mb-1">Ota kategoriya</label>
                  <select
                    value={form.parentId}
                    onChange={(e) => setForm((f) => ({ ...f, parentId: e.target.value }))}
                    className={inputClass}
                  >
                    <option value="">— Yo‘q (asosiy) —</option>
                    {categories
                      .filter((c) => editing === 'new' || c.id !== editing.id)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name.uz}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#52796F] mb-1">Tartib raqami</label>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={form.sortOrder}
                    onChange={(e) => setForm((f) => ({ ...f, sortOrder: Math.trunc(Number(e.target.value)) || 0 }))}
                    className={inputClass}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 font-bold text-[#1A2E26] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                />
                Faol (saytda ko‘rinadi)
              </label>
              {!form.isActive && (
                <InlineAlert
                  tone="info"
                  message="Nofaol kategoriya public API’dan qaytmaydi, shuning uchun saqlangandan keyin bu ro‘yxatda ham ko‘rinmaydi."
                />
              )}

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
