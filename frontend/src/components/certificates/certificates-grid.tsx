"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, Eye, ShieldCheck } from "lucide-react";
import { ImageLightbox } from "@/components/ui/image-lightbox";
import type { Locale } from "@/lib/i18n/locales";
import { localize } from "@/lib/types";

interface CertificateItem {
  id: string;
  title: { uz: string; ru: string; en: string };
  category: { uz: string; ru: string; en: string };
  certNumber: string;
  issuedBy: { uz: string; ru: string; en: string };
  validDate: string;
  image: string;
  fileUrl: string;
  description: { uz: string; ru: string; en: string };
}

interface CertificatesGridProps {
  locale: Locale;
}

export function CertificatesGrid({ locale }: CertificatesGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const certificates: CertificateItem[] = [
    {
      id: "cert-iso-22000",
      title: {
        uz: "ISO 22000:2018 Oziq-ovqat Xavfsizligi Boshqaruv Tizimi",
        ru: "ISO 22000:2018 Система Менеджмента Безопасности Пищевой Продукции",
        en: "ISO 22000:2018 Food Safety Management System",
      },
      category: {
        uz: "Xalqaro Sifat Standarti",
        ru: "Международный Стандарт",
        en: "International Standard",
      },
      certNumber: "UZ-FSMS-2026-8941",
      issuedBy: {
        uz: "O'zbekiston Standartlashtirish va Sertifikatlashtirish Idorasi",
        ru: "Агентство по Стандартизации и Сертификации Узбекистана",
        en: "Uzbekistan Agency for Standardization and Certification",
      },
      validDate: "2028-12-31",
      image: "/images/photo_2026-08-20_02-36-55.jpg",
      fileUrl: "/api/v1/media/download/iso-22000?file=images/photo_2026-08-20_02-36-55.jpg",
      description: {
        uz: "SABO zavodida sutni qabul qilishdan boshlab yakuniy qadoqlashgacha bo'lgan barcha jarayonlarning xalqaro xavfsizlik talablariga to'liq muvofiqligi.",
        ru: "Полное соответствие всех производственных процессов SABO международным строгим стандартам пищевой безопасности.",
        en: "Full compliance of all SABO production processes from fresh milk collection to packaging with international standards.",
      },
    },
    {
      id: "cert-haccp",
      title: {
        uz: "HACCP Xavf-xatarlarni Tahlil Qilish va Nazorat Nuqtalari",
        ru: "HACCP Анализ Рисков и Критические Контрольные Точки",
        en: "HACCP Hazard Analysis Critical Control Points",
      },
      category: {
        uz: "Laboratoriya & Nazorat",
        ru: "Лабораторный Контроль",
        en: "Lab & Quality Control",
      },
      certNumber: "UZ-HACCP-44219",
      issuedBy: {
        uz: "Sanitariya-Epidemiologiya Xizmati",
        ru: "Санитарно-Эпидемиологическая Служба",
        en: "Sanitary-Epidemiological Committee",
      },
      validDate: "2027-08-15",
      image: "/images/photo_2026-08-20_02-36-57.jpg",
      fileUrl: "/api/v1/media/download/haccp?file=images/photo_2026-08-20_02-36-57.jpg",
      description: {
        uz: "Har bir partiya tabiiy sut mahsulotlarining fizik-kimyoviy va mikrobiologik xavfsizligini ta'minlovchi kafolat sertifikati.",
        ru: "Сертификат гарантии физико-химической и микробиологической чистоты каждой партии натуральной продукции.",
        en: "Official quality guarantee ensuring physical, chemical, and microbiological purity of every dairy batch.",
      },
    },
    {
      id: "cert-halal",
      title: {
        uz: "HALOL Standarti Muvofiqlik Sertifikati",
        ru: "Сертификат Соответствия Стандарту ХАЛЯЛЬ",
        en: "HALAL Standard Compliance Certificate",
      },
      category: {
        uz: "Halol Sertifikati",
        ru: "Халяль Сертификат",
        en: "Halal Certified",
      },
      certNumber: "HALAL-UZ-998-0284",
      issuedBy: {
        uz: "O'zbekiston Musulmonlari Idorasi qoshidagi Halol Markazi",
        ru: "Центр Халяль при Управлении Мусульман Узбекистана",
        en: "Halal Center of Muslim Board of Uzbekistan",
      },
      validDate: "2028-06-30",
      image: "/images/photo_2026-08-20_02-36-51.jpg",
      fileUrl: "/api/v1/media/download/halal?file=images/photo_2026-08-20_02-36-51.jpg",
      description: {
        uz: "SABO mahsulotlari tarkibida faqat tabiiy, toza va halol ingrediyentlar ishlatilishi rasman tasdiqlangan.",
        ru: "Официальное подтверждение использования исключительно чистых и дозволенных натуральных ингредиентов.",
        en: "Official verification that SABO uses 100% natural, pure, and halal ingredients without artificial additives.",
      },
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {certificates.map((cert, idx) => (
          <div
            key={cert.id}
            className="p-6 rounded-3xl bg-surface border border-border hover:border-primary/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Certificate Image Frame */}
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-background border border-border mb-5 group-hover:border-primary/30 transition-colors">
                <Image
                  src={cert.image}
                  alt={localize(cert.title, locale)}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay with Quick View Button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedIndex(idx);
                      setLightboxOpen(true);
                    }}
                    className="p-3 rounded-full bg-white text-foreground shadow-lg hover:scale-110 transition-transform cursor-pointer"
                    title="Kattalashtirib ko'rish"
                  >
                    <Eye className="size-5" />
                  </button>
                  <a
                    href={cert.fileUrl}
                    download
                    className="p-3 rounded-full bg-primary text-white shadow-lg hover:scale-110 transition-transform cursor-pointer"
                    title="Faylni yuklab olish"
                  >
                    <Download className="size-5" />
                  </a>
                </div>

                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface/90 backdrop-blur-md text-[11px] font-extrabold text-emerald-600 border border-border shadow-xs">
                    <ShieldCheck className="size-3.5" />
                    <span>{localize(cert.category, locale)}</span>
                  </span>
                </div>
              </div>

              {/* Title & Organization */}
              <h3 className="font-display font-bold text-lg text-foreground mb-2 leading-snug">
                {localize(cert.title, locale)}
              </h3>
              <p className="text-xs text-muted leading-relaxed mb-4">
                {localize(cert.description, locale)}
              </p>

              {/* Meta information */}
              <div className="p-3.5 rounded-xl bg-background/70 border border-border space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted font-medium">Sertifikat №:</span>
                  <span className="font-mono font-bold text-foreground">{cert.certNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted font-medium">Amal qilish muddati:</span>
                  <span className="font-bold text-emerald-600">{cert.validDate}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 mt-6 border-t border-border flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedIndex(idx);
                  setLightboxOpen(true);
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-border bg-surface text-xs font-bold text-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
              >
                <Eye className="size-4" />
                <span>Ko&apos;rish</span>
              </button>

              <a
                href={cert.fileUrl}
                download
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary-hover transition-colors cursor-pointer"
              >
                <Download className="size-4" />
                <span>Yuklab olish</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <ImageLightbox
        images={certificates.map((c) => ({
          src: c.image,
          title: localize(c.title, locale),
        }))}
        initialIndex={selectedIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
