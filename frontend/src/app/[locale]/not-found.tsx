import Image from "next/image";
import { Home, Package } from "lucide-react";

import { LocalizedLink } from "@/components/layout/localized-link";
import { Container } from "@/components/ui/container";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/i18n/locales";

export default async function NotFound({
  params,
}: {
  params?: Promise<{ locale: string }>;
}) {
  const resolved: { locale?: string } = (await params) ?? {};
  const locale = isLocale(resolved.locale) ? resolved.locale : "uz";
  const dict = getDictionary(locale);

  return (
    <section className="relative flex-1 flex items-center justify-center py-24 lg:py-32 min-h-[75vh] overflow-hidden">
      {/* Blurred Atmospheric Background Image */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <Image
          src="/images/image-060.jpg"
          alt="SABO Fresh Milk Background"
          fill
          priority
          className="object-cover object-center scale-105 filter blur-xs opacity-40 dark:opacity-30 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-background/80 dark:bg-black/80 backdrop-blur-xs" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
      </div>

      <Container className="relative z-10">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center p-8 sm:p-12 rounded-3xl bg-surface/75 dark:bg-black/50 backdrop-blur-xl border border-border/80 shadow-2xl">
          {/* 404 Number */}
          <div className="mb-3">
            <div className="text-8xl sm:text-9xl lg:text-[10rem] font-black tracking-tight text-primary font-display leading-none drop-shadow-sm select-none">
              404
            </div>
          </div>

          {/* Title & Description */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight font-display mb-3">
            {dict.common.notFoundTitle || "Bunday sahifa mavjud emas"}
          </h1>
          <p className="text-muted text-sm sm:text-base max-w-md mb-8 leading-relaxed font-medium">
            {dict.common.notFoundText ||
              "Siz tashrif buyurmoqchi bo'lgan sahifa manzili noto'g'ri kiritilgan, o'chirilgan yoki nomi o'zgargan bo'lishi mumkin."}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <LocalizedLink
              href="/"
              locale={locale}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-bold text-sm shadow-md hover:bg-primary-dark transition-all cursor-pointer"
            >
              <Home className="size-4" />
              <span>{dict.common.goHome || "Bosh sahifaga qaytish"}</span>
            </LocalizedLink>

            <LocalizedLink
              href="/products"
              locale={locale}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-surface/90 border border-border text-foreground font-bold text-sm shadow-xs hover:border-primary hover:text-primary transition-all cursor-pointer"
            >
              <Package className="size-4" />
              <span>{dict.nav.products || "Mahsulotlar katalogi"}</span>
            </LocalizedLink>
          </div>
        </div>
      </Container>
    </section>
  );
}