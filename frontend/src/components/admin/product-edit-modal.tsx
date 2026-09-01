"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Save,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  Layers,
  Thermometer,
  Apple,
} from "lucide-react";
import type { LocalizedString, Product, ProductCategory, ProductNutritionInfo } from "@/lib/types";
import { apiClient } from "@/lib/api-client";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "mahsulot";
}

interface ProductEditModalProps {
  product: Product | null; // null means create new product
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

// This form edits all 3 languages at once, unlike the live Product type
// (which only carries the single currently-requested locale's text).
interface ProductFormData {
  name: LocalizedString;
  description: LocalizedString;
  category: ProductCategory | string;
  image: string;
  galleryImages: string[];
  price: number;
  fat: string;
  volumes: string[];
  availability: "in-stock" | "out-of-stock";
  colorAccent: string;
  colorTheme: string;
  badges: LocalizedString[];
  nutrition?: ProductNutritionInfo;
  storage?: {
    temperatureMin: number;
    temperatureMax: number;
    shelfLife: LocalizedString;
    storageText: LocalizedString;
  };
}

export function ProductEditModal({
  product,
  isOpen,
  onClose,
  onSaved,
}: ProductEditModalProps) {
  const isEditing = !!product;

  const [formData, setFormData] = useState<ProductFormData>({
    name: { uz: "", ru: "", en: "" },
    description: { uz: "", ru: "", en: "" },
    category: "milk",
    image: "/images/products/Sabo_Milk.jpg",
    galleryImages: [],
    price: 13000,
    fat: "3.2%",
    volumes: ["1 L"],
    availability: "in-stock",
    colorAccent: "#2F6B45",
    colorTheme: "green",
    badges: [{ uz: "100% Tabiiy", ru: "100% Натуральное", en: "100% Natural" }],
    nutrition: {
      calories: 60,
      protein: 3.0,
      fat: 3.2,
      carbohydrates: 4.7,
      calcium: 120,
      sugar: 4.6,
    },
    storage: {
      temperatureMin: 2,
      temperatureMax: 6,
      shelfLife: { uz: "10 kun", ru: "10 дней", en: "10 days" },
      storageText: {
        uz: "Muzlatgichda saqlansin (+2°C dan +6°C gacha)",
        ru: "Хранить в холодильнике (от +2°C до +6°C)",
        en: "Store refrigerated (+2°C to +6°C)",
      },
    },
  });

  const [activeTab, setActiveTab] = useState<"general" | "images" | "nutrition" | "storage">("general");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newVolumeInput, setNewVolumeInput] = useState("");
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [categoryIds, setCategoryIds] = useState<Record<string, string>>({});

  useEffect(() => {
    apiClient.getCategories().then((res) => {
      if (res.success && res.data) {
        const map: Record<string, string> = {};
        for (const c of res.data) map[c.slug] = c.id;
        setCategoryIds(map);
      }
    });
  }, []);

  useEffect(() => {
    if (product) {
      // The live product only carries the single currently-resolved locale's
      // text; fetch uz/ru/en in parallel so all 3 language fields can be edited.
      Promise.all(
        (["uz", "ru", "en"] as const).map((locale) =>
          apiClient.getProductBySlug(product.slug, locale),
        ),
      ).then(([uzRes, ruRes, enRes]) => {
        setFormData({
          name: {
            uz: uzRes.data?.name || product.name,
            ru: ruRes.data?.name || "",
            en: enRes.data?.name || "",
          },
          description: {
            uz: uzRes.data?.description || product.description || "",
            ru: ruRes.data?.description || "",
            en: enRes.data?.description || "",
          },
          category: product.category,
          image: product.image,
          galleryImages: product.galleryImages ? [...product.galleryImages] : [product.image],
          price: product.price ?? 0,
          fat: product.fat ?? "",
          volumes: product.volumes ? [...product.volumes] : ["1 L"],
          availability: product.availability ?? "in-stock",
          colorAccent: product.colorAccent ?? "#2F6B45",
          colorTheme: product.colorTheme ?? "green",
          badges: product.badges ? [...product.badges] : [],
          nutrition: product.nutrition ? { ...product.nutrition } : undefined,
          storage: product.storage
            ? {
                temperatureMin: product.storage.temperatureMin,
                temperatureMax: product.storage.temperatureMax,
                shelfLife: { uz: product.storage.shelfLife, ru: "", en: "" },
                storageText: { uz: product.storage.storageText, ru: "", en: "" },
              }
            : undefined,
        });
      });
    } else {
      setFormData({
        name: { uz: "", ru: "", en: "" },
        description: { uz: "", ru: "", en: "" },
        category: "milk",
        image: "/images/products/Sabo_Milk.jpg",
        galleryImages: ["/images/products/Sabo_Milk.jpg"],
        price: 13000,
        fat: "3.2%",
        volumes: ["1 L"],
        availability: "in-stock",
        colorAccent: "#2F6B45",
        colorTheme: "green",
        badges: [{ uz: "100% Tabiiy", ru: "100% Натуральное", en: "100% Natural" }],
        nutrition: {
          calories: 60,
          protein: 3.0,
          fat: 3.2,
          carbohydrates: 4.7,
          calcium: 120,
          sugar: 4.6,
        },
        storage: {
          temperatureMin: 2,
          temperatureMax: 6,
          shelfLife: { uz: "10 kun", ru: "10 дней", en: "10 days" },
          storageText: {
            uz: "Muzlatgichda saqlansin (+2°C dan +6°C gacha)",
            ru: "Хранить в холодильнике (от +2°C до +6°C)",
            en: "Store refrigerated (+2°C to +6°C)",
          },
        },
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.uz) {
      setErrorMessage("Mahsulot nomi (O'zbekcha) kiritilishi shart!");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    const translations = (["uz", "ru", "en"] as const)
      .filter((locale) => formData.name?.[locale])
      .map((locale) => ({
        locale,
        name: formData.name![locale],
        description: formData.description?.[locale] || undefined,
        storageText: formData.storage?.storageText?.[locale] || undefined,
      }));

    const priceMinor = Math.round((formData.price || 0) * 100);
    const volumes = formData.volumes && formData.volumes.length > 0 ? formData.volumes : [null];

    try {
      if (isEditing && product) {
        // Note: the backend's admin update endpoint currently only persists
        // slug/name/description/category/status/isFeatured/isActive/translations —
        // variant price, images, nutrition, and storage edits are not yet
        // applied on update (backend limitation, not this form's).
        const res = await apiClient.updateProduct(product.id, {
          slug: product.slug,
          name: formData.name?.uz,
          description: formData.description?.uz || undefined,
          categoryId: categoryIds[formData.category as string] || undefined,
          translations,
        });
        if (res.success && res.data) {
          onSaved();
          onClose();
        } else {
          setErrorMessage(res.error?.message || "Mahsulotni saqlashda xatolik");
        }
      } else {
        const res = await apiClient.createProduct({
          slug: slugify(formData.name?.uz || ""),
          name: formData.name?.uz,
          description: formData.description?.uz || undefined,
          categoryId: categoryIds[formData.category as string] || undefined,
          status: "ACTIVE",
          isActive: true,
          isFeatured: false,
          translations,
          variants: volumes.map((volume, idx) => ({
            name: `${formData.name?.uz || ""}${volume ? ` ${volume}` : ""}`.trim(),
            volume,
            priceMinor,
            currency: "UZS",
            stock: 100,
            isAvailable: formData.availability !== "out-of-stock",
            isDefault: idx === 0,
          })),
          nutrition: formData.nutrition
            ? {
                calories: formData.nutrition.calories,
                protein: formData.nutrition.protein,
                fat: formData.nutrition.fat,
                carbohydrates: formData.nutrition.carbohydrates,
                sugar: formData.nutrition.sugar,
              }
            : undefined,
          storage: formData.storage
            ? {
                temperatureMin: formData.storage.temperatureMin,
                temperatureMax: formData.storage.temperatureMax,
                shelfLife: formData.storage.shelfLife?.uz,
                storageText: formData.storage.storageText?.uz,
              }
            : undefined,
        });
        if (res.success && res.data) {
          onSaved();
          onClose();
        } else {
          setErrorMessage(res.error?.message || "Mahsulotni yaratishda xatolik");
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Xatolik yuz berdi";
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddVolume = () => {
    if (!newVolumeInput.trim()) return;
    const vol = newVolumeInput.trim();
    if (!formData.volumes?.includes(vol)) {
      setFormData((prev) => ({
        ...prev,
        volumes: [...(prev.volumes || []), vol],
      }));
    }
    setNewVolumeInput("");
  };

  const handleRemoveVolume = (vol: string) => {
    setFormData((prev) => ({
      ...prev,
      volumes: prev.volumes?.filter((v) => v !== vol) || [],
    }));
  };

  const handleAddGalleryImage = () => {
    if (!newGalleryUrl.trim()) return;
    const url = newGalleryUrl.trim();
    setFormData((prev) => ({
      ...prev,
      galleryImages: [...(prev.galleryImages || []), url],
    }));
    setNewGalleryUrl("");
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages?.filter((_, i) => i !== index) || [],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-surface border border-border shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-surface-elevated">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center font-bold">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg sm:text-xl text-foreground">
                {isEditing ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
              </h2>
              <p className="text-xs text-muted">
                {isEditing
                  ? `Slug: ${product.slug}`
                  : "SABO mahsulotlar katalogiga yangi mahsulot kiritish"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-surface border border-transparent hover:border-border transition-all cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-4 border-b border-border bg-background/50 overflow-x-auto">
          {[
            { id: "general" as const, label: "Asosiy ma'lumotlar", icon: Layers },
            { id: "images" as const, label: "Rasmlar & Galereya", icon: ImageIcon },
            { id: "nutrition" as const, label: "Ozuqaviy qiymati", icon: Apple },
            { id: "storage" as const, label: "Saqlash sharoiti", icon: Thermometer },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-primary text-white shadow-xs"
                    : "bg-surface border border-border text-muted hover:text-foreground"
                }`}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-action-red/10 border border-action-red/20 text-action-red text-xs font-bold">
              {errorMessage}
            </div>
          )}

          {/* TAB 1: GENERAL */}
          {activeTab === "general" && (
            <div className="space-y-5">
              {/* Names in 3 Languages */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-muted block">
                  Mahsulot nomi (3 tilda)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-muted uppercase">O&apos;zbekcha *</span>
                    <input
                      type="text"
                      required
                      value={formData.name?.uz || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: { ...prev.name!, uz: e.target.value },
                        }))
                      }
                      placeholder="Masalan: SABO Sut 3.2%"
                      className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-semibold text-foreground focus:border-primary outline-hidden"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted uppercase">Русский</span>
                    <input
                      type="text"
                      value={formData.name?.ru || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: { ...prev.name!, ru: e.target.value },
                        }))
                      }
                      placeholder="SABO Молоко 3.2%"
                      className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-semibold text-foreground focus:border-primary outline-hidden"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted uppercase">English</span>
                    <input
                      type="text"
                      value={formData.name?.en || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: { ...prev.name!, en: e.target.value },
                        }))
                      }
                      placeholder="SABO Milk 3.2%"
                      className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-semibold text-foreground focus:border-primary outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Category, Price & Fat */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-muted block mb-1">
                    Toifa
                  </label>
                  <select
                    value={formData.category || "milk"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value as ProductCategory,
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-semibold text-foreground focus:border-primary outline-hidden cursor-pointer"
                  >
                    <option value="milk">Sut (Milk)</option>
                    <option value="kefir">Kefir</option>
                    <option value="yogurt">Yogurt</option>
                    <option value="sour-cream">Smetana</option>
                    <option value="cream">Qaymoq</option>
                    <option value="butter">Sariyog&apos;</option>
                    <option value="other">Boshqa</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-muted block mb-1">
                    Narxi (UZS)
                  </label>
                  <input
                    type="number"
                    value={formData.price || 0}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: parseInt(e.target.value, 10) || 0,
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-bold text-foreground focus:border-primary outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-muted block mb-1">
                    Yog&apos;lilik darajasi
                  </label>
                  <input
                    type="text"
                    value={formData.fat || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, fat: e.target.value }))
                    }
                    placeholder="3.2%"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-bold text-foreground focus:border-primary outline-hidden"
                  />
                </div>
              </div>

              {/* Volumes Tag Editor */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-muted block mb-1.5">
                  Mavjud hajmlar (Volumes)
                </label>
                <div className="flex flex-wrap gap-2 items-center mb-2">
                  {formData.volumes?.map((vol) => (
                    <span
                      key={vol}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary text-white text-xs font-bold"
                    >
                      <span>{vol}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveVolume(vol)}
                        className="hover:text-red-200 cursor-pointer"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newVolumeInput}
                    onChange={(e) => setNewVolumeInput(e.target.value)}
                    placeholder="Yangi hajm (masalan: 1.5 L, 450 g)"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:border-primary outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddVolume}
                    className="px-4 py-2 rounded-xl bg-surface border border-border hover:border-primary text-xs font-bold text-foreground transition-colors cursor-pointer"
                  >
                    Qo&apos;shish
                  </button>
                </div>
              </div>

              {/* Color Accent & Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-muted block mb-1">
                    Qadoq Glow Nuri (Rang aksenti)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.colorAccent || "#2F6B45"}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, colorAccent: e.target.value }))
                      }
                      className="size-10 rounded-xl border border-border cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={formData.colorAccent || "#2F6B45"}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, colorAccent: e.target.value }))
                      }
                      className="flex-1 px-3.5 py-2 rounded-xl border border-border bg-background text-xs font-mono font-bold text-foreground focus:border-primary outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-muted block mb-1">
                    Mavjudlik holati
                  </label>
                  <select
                    value={formData.availability || "in-stock"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        availability: e.target.value as "in-stock" | "out-of-stock",
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-semibold text-foreground focus:border-primary outline-hidden cursor-pointer"
                  >
                    <option value="in-stock">Omborda mavjud (In stock)</option>
                    <option value="out-of-stock">Tugagan (Out of stock)</option>
                  </select>
                </div>
              </div>

              {/* Description UZ */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-muted block mb-1">
                  Tavsifi (O&apos;zbekcha)
                </label>
                <textarea
                  rows={3}
                  value={formData.description?.uz || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: { ...prev.description!, uz: e.target.value },
                    }))
                  }
                  placeholder="Mahsulot haqida batafsil ma'lumot..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:border-primary outline-hidden"
                />
              </div>
            </div>
          )}

          {/* TAB 2: IMAGES & GALLERY */}
          {activeTab === "images" && (
            <div className="space-y-6">
              {/* Main Image */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-muted block mb-1.5">
                  Asosiy Rasm URL
                </label>
                <div className="flex gap-4 items-center">
                  <div className="relative size-20 rounded-2xl overflow-hidden bg-background border border-border shrink-0 flex items-center justify-center">
                    {formData.image ? (
                      <Image
                        src={formData.image}
                        alt="Preview"
                        fill
                        className="object-contain p-1"
                      />
                    ) : (
                      <ImageIcon className="size-8 text-muted" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={formData.image || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, image: e.target.value }))
                      }
                      placeholder="/images/products/Sabo_Milk.jpg"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono text-foreground focus:border-primary outline-hidden"
                    />
                    <p className="text-[11px] text-muted">
                      Media kutubxonasidan nusxalangan havola yoki lokal yo&apos;l.
                    </p>
                  </div>
                </div>
              </div>

              {/* Gallery Images */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-muted block mb-2">
                  Ko&apos;p burchakli galereya rasmlari ({formData.galleryImages?.length || 0} ta)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  {formData.galleryImages?.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-2xl overflow-hidden bg-background border border-border p-2 group"
                    >
                      <Image
                        src={url}
                        alt={`Gallery ${idx + 1}`}
                        fill
                        className="object-contain p-2"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-action-red text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                        title="O'chirish"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    placeholder="/images/photo_2026-08-20_02-36-37.jpg"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono text-foreground focus:border-primary outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryImage}
                    className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors cursor-pointer shrink-0"
                  >
                    Galereyaga qo&apos;shish
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NUTRITION */}
          {activeTab === "nutrition" && (
            <div className="space-y-4">
              <p className="text-xs text-muted">
                100 g / 100 ml mahsulotdagi ozuqaviy moddalar miqdori:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Kaloriya (Kkal)
                  </label>
                  <input
                    type="number"
                    value={formData.nutrition?.calories || 0}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        nutrition: {
                          ...prev.nutrition!,
                          calories: parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-bold text-foreground focus:border-primary outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Oqsil (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.nutrition?.protein || 0}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        nutrition: {
                          ...prev.nutrition!,
                          protein: parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-bold text-foreground focus:border-primary outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Yog&apos; (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.nutrition?.fat || 0}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        nutrition: {
                          ...prev.nutrition!,
                          fat: parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-bold text-foreground focus:border-primary outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Uglevodlar (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.nutrition?.carbohydrates || 0}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        nutrition: {
                          ...prev.nutrition!,
                          carbohydrates: parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-bold text-foreground focus:border-primary outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Kalsiy (mg)
                  </label>
                  <input
                    type="number"
                    value={formData.nutrition?.calcium || 0}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        nutrition: {
                          ...prev.nutrition!,
                          calcium: parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-bold text-foreground focus:border-primary outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Shakar (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.nutrition?.sugar || 0}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        nutrition: {
                          ...prev.nutrition!,
                          sugar: parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-bold text-foreground focus:border-primary outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STORAGE */}
          {activeTab === "storage" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Min Harorat (°C)
                  </label>
                  <input
                    type="number"
                    value={formData.storage?.temperatureMin ?? 2}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        storage: {
                          ...prev.storage!,
                          temperatureMin: parseInt(e.target.value, 10) || 0,
                        },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-bold text-foreground focus:border-primary outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Max Harorat (°C)
                  </label>
                  <input
                    type="number"
                    value={formData.storage?.temperatureMax ?? 6}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        storage: {
                          ...prev.storage!,
                          temperatureMax: parseInt(e.target.value, 10) || 0,
                        },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-bold text-foreground focus:border-primary outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Yaroqlilik muddati (UZ)
                  </label>
                  <input
                    type="text"
                    value={formData.storage?.shelfLife?.uz || "10 kun"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        storage: {
                          ...prev.storage!,
                          shelfLife: {
                            ...prev.storage!.shelfLife,
                            uz: e.target.value,
                          },
                        },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-bold text-foreground focus:border-primary outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Saqlash yo&apos;riqnomasi (UZ)
                </label>
                <textarea
                  rows={2}
                  value={formData.storage?.storageText?.uz || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      storage: {
                        ...prev.storage!,
                        storageText: {
                          ...prev.storage!.storageText,
                          uz: e.target.value,
                        },
                      },
                    }))
                  }
                  placeholder="Muzlatgichda saqlansin (+2°C dan +6°C gacha)..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:border-primary outline-hidden"
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-6 border-t border-border flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-border bg-surface text-xs font-bold text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/20 hover:bg-primary-hover transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="size-4" />
              <span>{isSaving ? "Saqlanmoqda..." : "Saqlash va Tasdiqlash"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
