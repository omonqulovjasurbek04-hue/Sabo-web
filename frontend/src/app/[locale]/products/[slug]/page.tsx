import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductImageGallery } from "@/components/product/product-image-gallery";
import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import { ProductSpecsTabs } from "@/components/product/product-specs-tabs";
import { LocalizedLink } from "@/components/layout/localized-link";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductGrid } from "@/components/product/product-grid";
import { getCategoryBySlug } from "@/data/categories";
import { getProductBySlug, getRelatedProducts, products } from "@/data/products";
import { getDictionary } from "@/lib/i18n/dictionary";
import { locales, isLocale, type Locale } from "@/lib/i18n/locales";
import { generatePageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { localize } from "@/lib/types";

interface ProductDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  const params: Array<{ locale: Locale; slug: string }> = [];
  for (const locale of locales) {
    for (const product of products) {
      params.push({ locale, slug: product.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const product = getProductBySlug(slug);
  const dict = getDictionary(locale);
  if (!product) {
    return {
      title: dict.common.notFoundTitle,
    };
  }
  const name = localize(product.name, locale);
  return generatePageMetadata({
    locale,
    path: `/products/${product.slug}`,
    title: name,
    description: localize(product.description, locale),
    image: product.image,
  });
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategoryBySlug(product.category);
  const related = getRelatedProducts(product);
  const name = localize(product.name, locale);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    image: absoluteUrl(product.image),
    brand: { "@type": "Brand", name: "SABO" },
    category: localize(category.name, locale),
    description: localize(product.description, locale),
    ...(product.price !== null
      ? {
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "UZS",
            availability:
              product.availability === "in-stock"
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
          },
        }
      : {}),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: dict.nav.home,
        item: absoluteUrl(`/${locale}`),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: dict.nav.products,
        item: absoluteUrl(`/${locale}/products`),
      },
      {
        "@type": "ListItem",
        position: 3,
        name,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="py-10 md:py-16">
        <Container>
          <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 list-none p-0">
              <li className="flex items-center gap-2">
                <LocalizedLink href="/" locale={locale} className="hover:text-primary transition-colors">
                  {dict.nav.home}
                </LocalizedLink>
                <span className="text-border-strong">/</span>
              </li>
              <li className="flex items-center gap-2">
                <LocalizedLink href="/products" locale={locale} className="hover:text-primary transition-colors">
                  {dict.nav.products}
                </LocalizedLink>
                <span className="text-border-strong">/</span>
              </li>
              <li aria-current="page" className="text-foreground font-medium">{name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Product Image Gallery with 3D & Lightbox */}
            <div className="lg:sticky lg:top-[calc(var(--header-height)+24px)]">
              <ProductImageGallery
                mainImage={product.image}
                galleryImages={product.galleryImages}
                productName={name}
                colorAccent={product.colorAccent}
                labels={{
                  hint: dict.product.viewerHint,
                  reset: dict.product.viewerReset,
                  fullscreen: dict.product.viewerFullscreen,
                  exitFullscreen: dict.product.viewerExitFullscreen,
                }}
              />
            </div>

            {/* Product Details & Purchase Panel */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <LocalizedLink
                  href="/products"
                  locale={locale}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-primary transition-colors w-fit"
                >
                  <ArrowLeftIcon width={16} height={16} />
                  {dict.nav.products}
                </LocalizedLink>
                <div className="flex gap-2 flex-wrap items-center">
                  <Badge tone="primary">
                    {localize(category.name, locale)}
                  </Badge>
                  {product.fat ? (
                    <Badge tone="accent">
                      {dict.product.fat}: {product.fat}
                    </Badge>
                  ) : null}
                  {product.badges?.map((b, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-secondary-soft text-secondary"
                    >
                      {localize(b, locale)}
                    </span>
                  ))}
                </div>
              </div>

              <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground">{name}</h1>

              <p className="text-base sm:text-lg text-muted leading-relaxed">
                {localize(product.description, locale)}
              </p>

              {/* Purchase Panel with Volumes, Add-ons and Dynamic Cart Sync */}
              <ProductPurchasePanel
                product={product}
                locale={locale}
                dict={dict}
              />
            </div>
          </div>

          {/* Full Specifications, Nutrition, Storage and Certificates Tabs */}
          <ProductSpecsTabs product={product} locale={locale} />

          {related.length > 0 ? (
            <div className="mt-16">
              <SectionHeading title={dict.product.related} align="left" />
              <ProductGrid products={related} locale={locale} dict={dict} />
            </div>
          ) : null}
        </Container>
      </section>
    </>
  );
}