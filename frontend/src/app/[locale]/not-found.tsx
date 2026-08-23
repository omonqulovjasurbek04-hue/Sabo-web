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
    <section className="relative isolate flex-1 flex items-center justify-center py-16 sm:py-24 lg:py-32 min-h-[75vh] overflow-hidden">
      {/* Real Background Image — clearly visible */}
      <Image
        src="/images/products/image-060.jpg"
        alt="SABO 404 Background"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 object-cover object-center pointer-events-none -z-10"
      />

      {/* Subtle contrast overlay so background image is fully visible */}
      <div className="absolute inset-0 bg-black/15 dark:bg-black/55 pointer-events-none -z-10 transition-colors" />

      <Container className="relative z-10">
        {/* Frosted Glass Card (Light & Dark) with backdrop-blur */}
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center p-8 sm:p-12 rounded-3xl bg-white/50 dark:bg-[#122019]/75 backdrop-blur-xl backdrop-saturate-150 border border-white/70 dark:border-emerald-500/25 shadow-2xl shadow-black/25 transition-colors">
          <div className="mb-2">
            <div className="text-8xl sm:text-9xl lg:text-[9.5rem] font-black tracking-tight text-primary dark:text-[#76A978] font-display leading-none drop-shadow-md select-none">
              404
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground dark:text-[#F3F6F1] tracking-tight font-display mb-3 drop-shadow-xs">
            {dict.common?.notFoundTitle || "Bunday sahifa mavjud emas"}
          </h1>

          <p className="text-foreground/80 dark:text-[#CBD4CD] text-sm sm:text-base max-w-md mb-8 leading-relaxed font-semibold">
            {dict.common?.notFoundText ||
              "Siz tashrif buyurmoqchi bo'lgan sahifa manzili noto'g'ri kiritilgan, o'chirilgan yoki nomi o'zgargan bo'lishi mumkin."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <LocalizedLink
              href="/"
              locale={locale}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-primary dark:bg-[#2F6B45] hover:bg-primary-hover dark:hover:bg-[#3D8557] text-white font-bold text-sm shadow-lg shadow-primary/30 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Home className="size-4" />
              <span>{dict.common?.goHome || "Bosh sahifaga qaytish"}</span>
            </LocalizedLink>

            <LocalizedLink
              href="/products"
              locale={locale}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white/80 dark:bg-[#1A2E24]/80 backdrop-blur-md border border-white/90 dark:border-emerald-500/30 text-foreground dark:text-[#F3F6F1] hover:text-primary dark:hover:text-[#76A978] font-bold text-sm shadow-md hover:bg-white dark:hover:bg-[#20362B] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Package className="size-4" />
              <span>{dict.nav?.products || "Mahsulotlar katalogi"}</span>
            </LocalizedLink>
          </div>
        </div>
      </Container>
    </section>
  );
}