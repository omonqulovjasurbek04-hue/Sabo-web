"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FileText,
  Activity,
  Thermometer,
  ShieldCheck,
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import type { Product, LocalizedString } from "@/lib/types";
import type { Locale } from "@/lib/i18n/locales";
import { localize } from "@/lib/types";
import { ImageLightbox } from "@/components/ui/image-lightbox";

interface ProductSpecsTabsProps {
  product: Product;
  locale: Locale;
}

export function ProductSpecsTabs({ product, locale }: ProductSpecsTabsProps) {
  const [activeTab, setActiveTab] = useState<"nutrition" | "storage" | "ingredients" | "certificates">("nutrition");
  const [certLightboxOpen, setCertLightboxOpen] = useState(false);
  const [certIndex, setCertIndex] = useState(0);

  // Default nutritional specs if not explicitly defined
  const nutrition = product.nutrition || {
    calories: product.category === "sour-cream" ? 206 : product.category === "cream" ? 335 : 58,
    protein: product.category === "sour-cream" ? 2.5 : 3.0,
    fat: parseFloat(product.fat || "3.2") || 3.2,
    carbohydrates: 4.7,
    calcium: 120,
    sugar: 4.5,
  };

  const defaultStorage = {
    uz: {
      shelfLife: "14 kun (+2°C dan +6°C gacha)",
      storageText: "Qadoq ochilgandan so'ng muzlatgichda 48 soat ichida iste'mol qilinishi tavsiya etiladi.",
    },
    ru: {
      shelfLife: "14 дней (от +2°C до +6°C)",
      storageText: "После вскрытия упаковки употребить в течение 48 часов, хранить в холодильнике.",
    },
    en: {
      shelfLife: "14 days (+2°C to +6°C)",
      storageText: "After opening, store refrigerated and consume within 48 hours.",
    },
  }[locale];

  const storage = product.storage || {
    temperatureMin: 2,
    temperatureMax: 6,
    shelfLife: defaultStorage.shelfLife,
    storageText: defaultStorage.storageText,
  };

  const certificates = [
    {
      id: "iso-22000",
      title: {
        uz: "ISO 22000:2018 Xalqaro Oziq-ovqat Xavfsizligi",
        ru: "ISO 22000:2018 Международная Безопасность Пищевой Продукции",
        en: "ISO 22000:2018 International Food Safety Standard",
      },
      certNumber: "UZ-FSMS-2026-894",
      issuer: "O'zbekiston Standartlashtirish Agentligi",
      validUntil: "2028-12-31",
      previewImage: "/images/photo_2026-08-20_02-36-55.jpg",
      documentUrl: "/api/v1/media/download/iso22000?file=images/photo_2026-08-20_02-36-55.jpg",
    },
    {
      id: "haccp",
      title: {
        uz: "HACCP Sifat Nazorati Tizimi",
        ru: "HACCP Система Контроля Качества",
        en: "HACCP Hazard Analysis Quality System",
      },
      certNumber: "UZ-HACCP-4421",
      issuer: "Sanitariya-Epidemiologiya Qo'mitasi",
      validUntil: "2027-08-15",
      previewImage: "/images/photo_2026-08-20_02-36-57.jpg",
      documentUrl: "/api/v1/media/download/haccp?file=images/photo_2026-08-20_02-36-57.jpg",
    },
    {
      id: "halal",
      title: {
        uz: "HALOL Standarti Muvofiqlik Sertifikati",
        ru: "Сертификат Соответствия Стандарту ХАЛЯЛЬ",
        en: "HALAL Standard Compliance Certificate",
      },
      certNumber: "HALAL-UZ-998-02",
      issuer: "O'zbekiston Musulmonlari Idorasi",
      validUntil: "2028-06-30",
      previewImage: "/images/photo_2026-08-20_02-36-51.jpg",
      documentUrl: "/api/v1/media/download/halal?file=images/photo_2026-08-20_02-36-51.jpg",
    },
  ];

  const defaultIngredients: LocalizedString = {
    uz: "Normallashtirilgan toza sigir suti, tirik achitqi kulturalari (yogurt va kefir uchun). Konservantlar va sun'iy qo'shimchalardan xoli.",
    ru: "Нормализованное цельное коровье молоко, живые заквасочные культуры. Без консервантов и ГМО.",
    en: "Normalized pure whole cow's milk, live active starter cultures. Free from preservatives and artificial additives.",
  };

  const ingredientsText = product.ingredients ? localize(product.ingredients, locale) : localize(defaultIngredients, locale);

  return (
    <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-sm">
      {/* Tabs Header */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab("nutrition")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer shrink-0 ${
            activeTab === "nutrition"
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "text-muted hover:bg-surface-elevated hover:text-foreground"
          }`}
        >
          <Activity className="size-4" />
          <span>{locale === "ru" ? "Пищевая ценность" : locale === "en" ? "Nutrition Facts" : "Ozuqaviy qiymati"}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("storage")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer shrink-0 ${
            activeTab === "storage"
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "text-muted hover:bg-surface-elevated hover:text-foreground"
          }`}
        >
          <Thermometer className="size-4" />
          <span>{locale === "ru" ? "Условия хранения" : locale === "en" ? "Storage Conditions" : "Saqlash sharoiti"}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ingredients")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer shrink-0 ${
            activeTab === "ingredients"
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "text-muted hover:bg-surface-elevated hover:text-foreground"
          }`}
        >
          <FileText className="size-4" />
          <span>{locale === "ru" ? "Состав и качество" : locale === "en" ? "Ingredients & Quality" : "Tarkibi va sifati"}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("certificates")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer shrink-0 ${
            activeTab === "certificates"
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "text-muted hover:bg-surface-elevated hover:text-foreground"
          }`}
        >
          <ShieldCheck className="size-4" />
          <span>{locale === "ru" ? "Сертификаты" : locale === "en" ? "Certificates" : "Sertifikatlar"}</span>
        </button>
      </div>

      {/* Tab Content 1: Nutrition Facts */}
      {activeTab === "nutrition" && (
        <div className="pt-6">
          <div className="mb-4">
            <h3 className="font-display font-bold text-lg text-foreground">
              {locale === "ru" ? "Пищевая и энергетическая ценность (на 100 г)" : locale === "en" ? "Nutritional Values (per 100g/ml)" : "Ozuqaviy va energetik qiymati (100 g mahsulotda)"}
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Tabiiy sigir sutidan olingan foydali minerallar va oqsil manbai.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="p-4 rounded-2xl bg-background/80 border border-border text-center">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted block mb-1">
                Kaloriya
              </span>
              <span className="text-xl font-black font-display text-foreground">
                {nutrition.calories} <span className="text-xs font-bold text-muted">kkal</span>
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-background/80 border border-border text-center">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted block mb-1">
                Oqsillar (Protein)
              </span>
              <span className="text-xl font-black font-display text-foreground">
                {nutrition.protein} <span className="text-xs font-bold text-muted">g</span>
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-background/80 border border-border text-center">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted block mb-1">
                Yog&apos;lilik
              </span>
              <span className="text-xl font-black font-display text-foreground">
                {nutrition.fat}%
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-background/80 border border-border text-center">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted block mb-1">
                Uglevodlar
              </span>
              <span className="text-xl font-black font-display text-foreground">
                {nutrition.carbohydrates} <span className="text-xs font-bold text-muted">g</span>
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-background/80 border border-border text-center">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted block mb-1">
                Kalsiy (Ca)
              </span>
              <span className="text-xl font-black font-display text-emerald-600">
                {nutrition.calcium || 120} <span className="text-xs font-bold text-muted">mg</span>
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-background/80 border border-border text-center">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted block mb-1">
                Tabiiy qand
              </span>
              <span className="text-xl font-black font-display text-foreground">
                {nutrition.sugar || 4.5} <span className="text-xs font-bold text-muted">g</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Storage Conditions */}
      {activeTab === "storage" && (
        <div className="pt-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-sky-500 text-white">
                <Thermometer className="size-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground mb-1">
                  Optimal Saqlash Harorati
                </h4>
                <p className="text-lg font-black font-display text-sky-600">
                  +{storage.temperatureMin}°C dan +{storage.temperatureMax}°C gacha
                </p>
                <p className="text-xs text-muted mt-1">Muzlatgichda saqlash majburiy</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-primary-soft border border-primary/20 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary text-white">
                <CheckCircle2 className="size-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground mb-1">
                  Yaroqlilik Muddati
                </h4>
                <p className="text-base font-bold text-foreground">
                  {storage.shelfLife}
                </p>
                <p className="text-xs text-muted mt-1">
                  {storage.storageText}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 3: Ingredients & Quality */}
      {activeTab === "ingredients" && (
        <div className="pt-6 flex flex-col gap-5">
          <div className="p-5 rounded-2xl bg-background/80 border border-border">
            <h4 className="font-bold text-sm text-foreground mb-2 flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>Mahsulot Tarkibi (100% Tabiiy)</span>
            </h4>
            <p className="text-sm text-muted leading-relaxed">{ingredientsText}</p>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-medium">
            <AlertTriangle className="size-4 shrink-0 mt-0.5" />
            <span>
              <strong>Allergen haqida ogohlantirish:</strong> Mahsulot tarkibida tabiiy sut oqsili (laktoza) mavjud. Laktozaga nisbatan yuqori sezuvchanligi bo&apos;lgan shaxslar uchun ehtiyotkorlik tavsiya etiladi.
            </span>
          </div>
        </div>
      )}

      {/* Tab Content 4: Certificates & Documents */}
      {activeTab === "certificates" && (
        <div className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {certificates.map((cert, idx) => (
              <div
                key={cert.id}
                className="p-4 rounded-2xl bg-background/80 border border-border hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden mb-3 border border-border group">
                    <Image
                      src={cert.previewImage}
                      alt={localize(cert.title, locale)}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCertIndex(idx);
                        setCertLightboxOpen(true);
                      }}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                    >
                      <Eye className="size-6" />
                    </button>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-foreground line-clamp-2">
                    {localize(cert.title, locale)}
                  </h4>
                  <p className="text-[11px] text-muted font-mono mt-1">№ {cert.certNumber}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase">Tasdiqlangan</span>
                  <a
                    href={cert.documentUrl}
                    download
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-surface border border-border text-xs font-bold text-primary hover:bg-primary-soft transition-colors cursor-pointer shadow-2xs"
                  >
                    <Download className="size-3.5" />
                    <span>Yuklab olish</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <ImageLightbox
            images={certificates.map((c) => ({
              src: c.previewImage,
              title: localize(c.title, locale),
            }))}
            initialIndex={certIndex}
            isOpen={certLightboxOpen}
            onClose={() => setCertLightboxOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
