import type { Metadata } from "next";

import { CartProvider } from "@/components/cart/cart-provider";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/i18n/locales";
import { generatePageMetadata } from "@/lib/seo";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return generatePageMetadata({ locale, path: "/" });
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) return children;

  const dict = getDictionary(locale);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      <CartProvider>
        <Navbar dict={dict} locale={locale} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer dict={dict} locale={locale} />
      </CartProvider>
    </div>
  );
}