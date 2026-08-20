import type { ComponentType } from "react";

import { LocalizedLink } from "@/components/layout/localized-link";
import { Container } from "@/components/ui/container";
import {
  BowlIcon,
  ButterIcon,
  CupIcon,
  JarIcon,
  MilkIcon,
  PackageIcon,
} from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { categories } from "@/data/categories";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";
import type { ProductCategory } from "@/lib/types";
import { localize } from "@/lib/types";

const CATEGORY_ICONS: Record<ProductCategory, ComponentType<{ width?: number; height?: number }>> = {
  milk: MilkIcon,
  kefir: MilkIcon,
  yogurt: CupIcon,
  "sour-cream": BowlIcon,
  cream: JarIcon,
  butter: ButterIcon,
  other: PackageIcon,
};

export function CategoriesSection({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  return (
    <section className="py-14 sm:py-18">
      <Container>
        <SectionHeading
          title={dict.home.categoriesTitle}
          subtitle={dict.home.categoriesSubtitle}
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category, index) => {
            const Icon = CATEGORY_ICONS[category.slug];
            return (
              <Reveal key={category.slug} delay={index * 60}>
                <LocalizedLink
                  href={`/products?category=${category.slug}`}
                  locale={locale}
                  className="flex flex-col items-start gap-3 p-5 sm:p-6 rounded-2xl border border-border bg-surface shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-secondary group"
                >
                  <span
                    className="inline-flex items-center justify-center size-12 rounded-xl bg-secondary-soft text-secondary group-hover:scale-105 transition-transform"
                    aria-hidden="true"
                  >
                    <Icon width={24} height={24} />
                  </span>
                  <span className="font-sans font-semibold text-base sm:text-[17px] text-foreground group-hover:text-secondary transition-colors">
                    {localize(category.name, locale)}
                  </span>
                  <span className="text-xs sm:text-sm text-muted line-clamp-2">
                    {localize(category.description, locale)}
                  </span>
                </LocalizedLink>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}