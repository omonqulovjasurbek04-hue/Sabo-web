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
    <section className="py-20 lg:py-28 flex items-center justify-center min-h-[60vh]">
      <Container>
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
          {/* 404 Graphic Badge */}
          <div className="relative mb-6">
            <div className="text-8xl sm:text-9xl lg:text-[11rem] font-black tracking-tight text-primary/15 select-none font-display">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-extrabold text-sm sm:text-base uppercase tracking-widest shadow-xs">
                Xatolik 404
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight font-display mb-4">
            {dict.common.notFoundTitle || "Bunday sahifa mavjud emas"}
          </h1>
          <p className="text-muted text-base sm:text-lg max-w-lg mb-8 leading-relaxed font-medium">
            {dict.common.notFoundText || "Siz tashrif buyurmoqchi bo'lgan sahifa manzili noto'g'ri kiritilgan, o'chirilgan yoki nomi o'zgargan bo'lishi mumkin."}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <LocalizedLink
              href="/"
              locale={locale}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-primary text-white font-bold text-sm sm:text-base shadow-md hover:bg-primary-dark transition-all"
            >
              <Home className="size-4" />
              <span>{dict.common.goHome || "Bosh sahifaga qaytish"}</span>
            </LocalizedLink>

            <LocalizedLink
              href="/products"
              locale={locale}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-surface border border-border text-foreground font-bold text-sm sm:text-base shadow-xs hover:border-primary hover:text-primary transition-all"
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