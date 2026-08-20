import { ProductCard } from "@/components/product/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";
import type { Product } from "@/lib/types";

interface ProductGridProps {
  products: Product[];
  locale: Locale;
  dict: Dictionary;
}

export function ProductGrid({ products, locale, dict }: ProductGridProps) {
  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} locale={locale} dict={dict} />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div
          className="flex flex-col rounded-2xl border border-border bg-surface overflow-hidden shadow-xs"
          key={index}
        >
          <Skeleton className="aspect-square w-full rounded-t-2xl" />
          <div className="flex flex-col gap-2 p-5">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="mt-2 h-6 w-3/4" />
            <Skeleton className="mt-1 h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}