"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { ProductGrid } from "@/components/product/product-grid";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchIcon } from "@/components/ui/icons";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";
import type { Product } from "@/lib/types";
import { cn, formatResultsCount } from "@/lib/utils";

interface ProductCatalogProps {
  products: Product[];
  dict: Dictionary;
  locale: Locale;
  initialQuery: string;
  initialCategory: string;
}

const allCategory = "all" as const;

export function ProductCatalog({
  products,
  dict,
  locale,
  initialQuery,
  initialCategory,
}: ProductCatalogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);

  const categories: Array<{ slug: string; label: string }> = [
    { slug: allCategory, label: dict.products.filters.all },
    {
      slug: "milk",
      label: dict.products.filters.milk,
    },
    {
      slug: "kefir",
      label: dict.products.filters.kefir,
    },
    {
      slug: "yogurt",
      label: dict.products.filters.yogurt,
    },
    {
      slug: "sour-cream",
      label: dict.products.filters.sourCream,
    },
    {
      slug: "cream",
      label: dict.products.filters.cream,
    },
    {
      slug: "butter",
      label: dict.products.filters.butter,
    },
    {
      slug: "other",
      label: dict.products.filters.other,
    },
  ];

  const updateUrl = (nextQuery: string, nextCategory: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextQuery) params.set("q", nextQuery);
    else params.delete("q");
    if (nextCategory && nextCategory !== allCategory) {
      params.set("category", nextCategory);
    } else {
      params.delete("category");
    }
    const qs = params.toString();
    router.replace(`/${locale}/products${qs ? `?${qs}` : ""}`, {
      scroll: false,
    });
  };

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        category === allCategory || product.category === category;
      if (!matchesCategory) return false;
      if (!normalized) return true;
      const haystack = [
        product.name,
        product.description ?? "",
        product.fat ?? "",
        ...product.volumes,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [products, query, category]);

  const countLabel = formatResultsCount(
    filtered.length,
    dict.products.countSingular,
    dict.products.countFew,
    dict.products.countMany,
  );

  const selectCategory = (next: string) => {
    setCategory(next);
    updateUrl(query, next);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <form
          className="flex items-center gap-2.5 px-4 py-3 border border-border-strong rounded-xl bg-surface text-muted max-w-md focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary-soft transition-all"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            updateUrl(query, category);
          }}
        >
          <SearchIcon width={18} height={18} className="shrink-0 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={dict.products.searchPlaceholder}
            aria-label={dict.products.searchPlaceholder}
            className="w-full bg-transparent border-none outline-none text-foreground text-sm sm:text-base placeholder:text-muted"
          />
        </form>

        <div className="flex flex-wrap gap-2" role="group" aria-label={dict.products.title}>
          {categories.map((item) => (
            <button
              key={item.slug}
              type="button"
              className={cn(
                "inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-semibold transition-colors cursor-pointer",
                category === item.slug
                  ? "bg-secondary border-secondary text-white shadow-xs"
                  : "bg-surface border-border-strong text-muted hover:border-secondary hover:text-secondary"
              )}
              aria-pressed={category === item.slug}
              onClick={() => selectCategory(item.slug)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm font-medium text-muted" aria-live="polite">
        {filtered.length} {countLabel}
      </p>

      {filtered.length > 0 ? (
        <ProductGrid products={filtered} locale={locale} dict={dict} />
      ) : (
        <EmptyState
          title={dict.products.noResults}
          hint={dict.products.noResultsHint}
        />
      )}
    </div>
  );
}