import { LocalizedLink } from "@/components/layout/localized-link";
import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductGrid } from "@/components/product/product-grid";
import { products } from "@/data/products";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";

export function FeaturedProducts({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const featured = products.slice(0, 6);

  return (
    <section className="py-14 sm:py-18 bg-surface-soft transition-colors duration-200">
      <Container>
        <SectionHeading
          title={dict.home.featuredTitle}
          subtitle={dict.home.featuredSubtitle}
        />
        <Reveal>
          <ProductGrid products={featured} locale={locale} dict={dict} />
        </Reveal>
        <div className="flex justify-center mt-10">
          <LocalizedLink
            href="/products"
            locale={locale}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-sm sm:text-base border border-border-strong bg-surface text-foreground hover:border-secondary hover:text-secondary transition-colors"
          >
            {dict.home.viewAll}
            <ArrowRightIcon width={16} height={16} />
          </LocalizedLink>
        </div>
      </Container>
    </section>
  );
}