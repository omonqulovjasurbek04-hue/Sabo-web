import type { Metadata } from "next";

import { ProductCatalog } from "@/components/product/product-catalog";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { products } from "@/data/products";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/i18n/locales";
import { generatePageMetadata } from "@/lib/seo";

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; category?: string }>;
}

export async function generateMetadata({
  params,
}: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return generatePageMetadata({
    locale,
    path: "/products",
    title: dict.products.title,
    description: dict.products.subtitle,
  });
}

export default async function ProductsPage({
  params,
  searchParams,
}: ProductsPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;

  const { q, category } = await searchParams;
  const dict = getDictionary(locale);

  const validCategories = new Set([
    "milk",
    "kefir",
    "yogurt",
    "sour-cream",
    "cream",
    "butter",
    "other",
  ]);
  const initialCategory =
    category && validCategories.has(category) ? category : "all";

  return (
    <section className="py-12 md:py-16">
      <Container>
        <SectionHeading
          title={dict.products.title}
          subtitle={dict.products.subtitle}
          align="left"
          as="h1"
        />
        <ProductCatalog
          products={products}
          dict={dict}
          locale={locale}
          initialQuery={q ?? ""}
          initialCategory={initialCategory}
        />
      </Container>
    </section>
  );
}