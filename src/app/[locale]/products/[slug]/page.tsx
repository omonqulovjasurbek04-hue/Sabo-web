import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Product3DViewer } from "@/components/3d/product-3d-viewer";
import { LocalizedLink } from "@/components/layout/localized-link";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { ArrowLeftIcon, DropletIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductGrid } from "@/components/product/product-grid";
import { getCategoryBySlug } from "@/data/categories";
import { getProductBySlug, getRelatedProducts, products } from "@/data/products";
import { getDictionary } from "@/lib/i18n/dictionary";
import { locales, isLocale, type Locale } from "@/lib/i18n/locales";
import { generatePageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { localize } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

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
            {/* Product Image */}
            <div className="lg:sticky lg:top-[calc(var(--header-height)+24px)]">
              <div className="relative aspect-square rounded-[20px] overflow-hidden border border-border bg-surface shadow-xs">
                <Product3DViewer
                  src={product.image}
                  alt={name}
                  labels={{
                    hint: dict.product.viewerHint,
                    reset: dict.product.viewerReset,
                    fullscreen: dict.product.viewerFullscreen,
                    exitFullscreen: dict.product.viewerExitFullscreen,
                  }}
                />
              </div>
            </div>

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
                <div className="flex gap-2 flex-wrap">
                  <Badge tone="primary">
                    {localize(category.name, locale)}
                  </Badge>
                  {product.isPlaceholder ? (
                    <Badge tone="outline">{dict.footer.placeholders}</Badge>
                  ) : null}
                </div>
              </div>

              <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground">{name}</h1>

              <div className="flex flex-col gap-4">
                {product.volumes.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-muted">
                      {dict.product.volume}
                    </span>
                    <div className="flex gap-2 flex-wrap">
                      {product.volumes.map((volume) => (
                        <span
                          key={volume}
                          className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-primary text-white shadow-xs"
                        >
                          {volume}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {product.fat ? (
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-muted">
                      {dict.product.fat}
                    </span>
                    <Badge tone="accent" className="w-fit text-sm px-3 py-1">
                      {product.fat}
                    </Badge>
                  </div>
                ) : null}
              </div>

              <p className="text-base sm:text-lg text-muted leading-relaxed">
                {localize(product.description, locale)}
              </p>

              {product.price !== null ? (
                <p className="text-2xl sm:text-3xl font-bold text-action-red">
                  {formatPrice(product.price, locale)}
                </p>
              ) : null}

              {product.availability === "in-stock" ? (
                <Badge tone="accent" className="w-fit text-sm px-3 py-1">
                  {dict.product.inStock}
                </Badge>
              ) : product.availability === "out-of-stock" ? (
                <Badge tone="neutral" className="w-fit text-sm px-3 py-1">
                  {dict.product.outOfStock}
                </Badge>
              ) : null}

              <div className="flex gap-3 flex-wrap pt-2">
                <AddToCartButton
                  product={product}
                  locale={locale}
                  dict={dict}
                />
                <LocalizedLink
                  href="/contact"
                  locale={locale}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-base border border-border-strong bg-surface text-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {dict.contact.title}
                </LocalizedLink>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-16">
            <h2 className="font-sans font-bold text-2xl text-foreground">{dict.product.description}</h2>

            {product.volumes.length > 0 ? (
              <div className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-surface shadow-xs">
                <span
                  className="inline-flex items-center justify-center size-11 rounded-xl bg-primary-soft text-primary shrink-0"
                  aria-hidden="true"
                >
                  <DropletIcon width={20} height={20} />
                </span>
                <div>
                  <h3 className="font-sans font-semibold text-base text-foreground mb-0.5">
                    {dict.product.volume}
                  </h3>
                  <p className="text-sm text-muted">{product.volumes.join(" / ")}</p>
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-2 p-5 rounded-2xl bg-surface-soft text-primary text-sm">
              <p>{dict.product.nutritionNote}</p>
              <p>{dict.product.ingredientsNote}</p>
              <p>{dict.product.storageNote}</p>
            </div>
          </div>

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