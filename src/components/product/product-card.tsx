import Image from "next/image";

import { InteractiveProduct } from "@/components/3d/interactive-product";
import { LocalizedLink } from "@/components/layout/localized-link";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";
import { getCategoryBySlug } from "@/data/categories";
import type { Product } from "@/lib/types";
import { localize } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  locale: Locale;
  dict: Dictionary;
  priority?: boolean;
}

export function ProductCard({
  product,
  locale,
  dict,
  priority = false,
}: ProductCardProps) {
  const category = getCategoryBySlug(product.category);

  return (
    <article className="group flex flex-col rounded-[20px] border border-border bg-surface overflow-hidden shadow-xs hover:shadow-md hover:border-primary transition-all duration-300 hover:-translate-y-1">
      <InteractiveProduct className="relative aspect-square w-full bg-background overflow-hidden">
        <LocalizedLink
          href={`/products/${product.slug}`}
          locale={locale}
          className="block w-full h-full"
          aria-label={localize(product.name, locale)}
        >
          <Image
            src={product.image}
            alt={localize(product.name, locale)}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-102"
          />
        </LocalizedLink>
      </InteractiveProduct>

      <div className="flex flex-col gap-2.5 p-6 flex-1">
        <div className="flex items-center justify-between gap-2">
          <Badge tone="primary">{localize(category.name, locale)}</Badge>
          {product.isPlaceholder ? (
            <Badge tone="outline">{dict.footer.placeholders}</Badge>
          ) : null}
        </div>

        <h3 className="font-display font-semibold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          <LocalizedLink href={`/products/${product.slug}`} locale={locale}>
            {localize(product.name, locale)}
          </LocalizedLink>
        </h3>

        <p className="text-xs sm:text-sm text-muted line-clamp-2 leading-relaxed">
          {localize(product.description, locale)}
        </p>

        <div className="flex flex-wrap gap-3 text-xs text-muted mt-auto pt-2">
          {product.volumes.length > 0 ? (
            <span className="font-medium">
              {dict.product.volume}: {product.volumes.join(" / ")}
            </span>
          ) : null}
          {product.fat ? <span className="font-medium">{product.fat}</span> : null}
        </div>

        {product.price !== null ? (
          <p className="text-xl font-bold text-action-red">
            {formatPrice(product.price, locale)}
          </p>
        ) : null}

        <LocalizedLink
          href={`/products/${product.slug}`}
          locale={locale}
          className="inline-flex items-center gap-1.5 font-semibold text-sm text-action-red hover:text-action-red-dark mt-1 transition-colors group/link"
        >
          {dict.common.readMore}
          <ArrowRightIcon width={16} height={16} className="transition-transform group-hover/link:translate-x-1" />
        </LocalizedLink>
      </div>
    </article>
  );
}