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
  const colorAccent = product.colorAccent || "#2F6B45";

  return (
    <article className="group flex flex-col rounded-[24px] border border-border bg-surface overflow-hidden shadow-xs hover:shadow-lg hover:border-primary/50 transition-all duration-300 hover:-translate-y-1.5 relative">
      <InteractiveProduct className="relative aspect-square w-full bg-background/50 overflow-hidden">
        {/* Soft Ambient Product Glow */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none transition-opacity group-hover:opacity-25"
          style={{
            background: `radial-gradient(circle at center, ${colorAccent} 0%, transparent 70%)`,
          }}
        />

        <LocalizedLink
          href={`/products/${product.slug}`}
          locale={locale}
          className="block w-full h-full"
          aria-label={product.name}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className="object-contain p-5 transition-transform duration-300 group-hover:scale-105"
          />
        </LocalizedLink>

        {/* Top Floating Badge */}
        {product.badges && product.badges.length > 0 && (
          <div className="absolute top-3 left-3 pointer-events-none z-10">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-surface/90 backdrop-blur-md text-[10px] font-extrabold text-foreground border border-border shadow-xs">
              {localize(product.badges[0], locale)}
            </span>
          </div>
        )}
      </InteractiveProduct>

      <div className="flex flex-col gap-2.5 p-6 flex-1">
        <div className="flex items-center justify-between gap-2">
          <Badge tone="primary">{localize(category.name, locale)}</Badge>
          {product.fat ? (
            <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-surface-soft text-primary">
              {product.fat}
            </span>
          ) : null}
        </div>

        <h3 className="font-display font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          <LocalizedLink href={`/products/${product.slug}`} locale={locale}>
            {product.name}
          </LocalizedLink>
        </h3>

        <p className="text-xs sm:text-sm text-muted line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="flex flex-wrap items-center justify-between text-xs text-muted mt-auto pt-3 border-t border-border/60">
          {product.volumes.length > 0 ? (
            <span className="font-bold text-foreground">
              {product.volumes.join(" / ")}
            </span>
          ) : <span />}

          {product.price !== null ? (
            <span className="text-lg font-black font-display text-action-red">
              {formatPrice(product.price, locale)}
            </span>
          ) : null}
        </div>

        <LocalizedLink
          href={`/products/${product.slug}`}
          locale={locale}
          className="inline-flex items-center justify-between font-bold text-xs sm:text-sm text-primary hover:text-primary-dark mt-2 transition-colors group/link pt-1"
        >
          <span>{dict.common.readMore}</span>
          <ArrowRightIcon width={16} height={16} className="transition-transform group-hover/link:translate-x-1" />
        </LocalizedLink>
      </div>
    </article>
  );
}