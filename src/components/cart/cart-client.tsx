"use client";

import Image from "next/image";

import { useCart } from "@/components/cart/cart-provider";
import { LocalizedLink } from "@/components/layout/localized-link";
import { EmptyState } from "@/components/ui/empty-state";
import { ArrowLeftIcon } from "@/components/ui/icons";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";
import { formatPrice } from "@/lib/utils";

interface CartClientProps {
  dict: Dictionary;
  locale: Locale;
}

export function CartClient({ dict, locale }: CartClientProps) {
  const { items, subtotal, hasPrices, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <EmptyState
        title={dict.cart.emptyTitle}
        hint={dict.cart.emptyHint}
        actionHref="/products"
        actionLabel={dict.home.viewAll}
        locale={locale}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8 items-start">
      <div className="flex flex-col gap-4">
        {items.map((line) => (
          <div
            key={line.id}
            className="grid grid-cols-[80px_1fr] sm:grid-cols-[96px_1fr_auto] gap-4 p-4 sm:p-5 rounded-2xl border border-border bg-surface shadow-xs items-center"
          >
            <LocalizedLink
              href={`/products/${line.slug}`}
              locale={locale}
              className="size-20 sm:size-24 rounded-xl overflow-hidden bg-secondary-soft shrink-0 block"
            >
              <Image
                src={line.image}
                alt={line.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </LocalizedLink>

            <div className="flex flex-col gap-2 min-w-0">
              <LocalizedLink
                href={`/products/${line.slug}`}
                locale={locale}
                className="font-sans font-semibold text-base text-foreground hover:text-primary transition-colors line-clamp-1"
              >
                {line.name}
              </LocalizedLink>
              <div className="flex gap-3 text-xs sm:text-sm text-muted">
                {line.volume ? <span>{line.volume}</span> : null}
                {line.fat ? <span>{line.fat}</span> : null}
              </div>

              <div className="flex items-center gap-4 flex-wrap mt-1">
                <div
                  className="inline-flex items-center border border-border-strong rounded-lg overflow-hidden bg-surface"
                  aria-label={dict.cart.quantity}
                >
                  <button
                    type="button"
                    className="size-8 sm:size-9 inline-flex items-center justify-center font-bold text-foreground bg-surface hover:bg-secondary-soft hover:text-secondary transition-colors cursor-pointer"
                    onClick={() => updateQuantity(line.id, line.quantity - 1)}
                    aria-label={`- ${dict.cart.quantity}`}
                  >
                    −
                  </button>
                  <span className="min-w-9 text-center font-semibold text-sm">
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    className="size-8 sm:size-9 inline-flex items-center justify-center font-bold text-foreground bg-surface hover:bg-secondary-soft hover:text-secondary transition-colors cursor-pointer"
                    onClick={() => updateQuantity(line.id, line.quantity + 1)}
                    aria-label={`+ ${dict.cart.quantity}`}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="text-xs sm:text-sm font-semibold text-muted hover:text-primary underline cursor-pointer transition-colors"
                  onClick={() => removeItem(line.id)}
                >
                  {dict.cart.remove}
                </button>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 text-left sm:text-right font-bold text-lg text-primary whitespace-nowrap pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
              {line.price !== null ? (
                formatPrice(line.price * line.quantity, locale)
              ) : (
                <span className="text-xs font-normal text-muted block">
                  {dict.cart.priceNote}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <aside className="p-6 sm:p-7 rounded-2xl border border-border bg-surface shadow-xs sticky top-[calc(var(--header-height)+24px)] flex flex-col gap-5">
        <h2 className="font-sans font-bold text-xl text-foreground">{dict.cart.title}</h2>

        {hasPrices ? (
          <dl className="flex flex-col gap-3 m-0">
            <div className="flex justify-between gap-4 text-sm sm:text-base">
              <dt className="text-muted">{dict.cart.subtotal}</dt>
              <dd className="font-semibold text-right">
                {subtotal !== null ? formatPrice(subtotal, locale) : "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-4 text-sm sm:text-base">
              <dt className="text-muted">{dict.cart.delivery}</dt>
              <dd className="font-semibold text-right">{dict.cart.deliveryNote}</dd>
            </div>
            <div className="flex justify-between gap-4 text-lg font-bold border-t border-border pt-3 text-foreground">
              <dt>{dict.cart.total}</dt>
              <dd>{subtotal !== null ? formatPrice(subtotal, locale) : "—"} component</dd>
            </div>
          </dl>
        ) : (
          <p className="text-xs sm:text-sm p-3.5 rounded-xl bg-surface-soft text-secondary">
            {dict.cart.priceNote}
          </p>
        )}

        <LocalizedLink
          href="/checkout"
          locale={locale}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-bold text-base bg-primary text-white hover:bg-primary-dark shadow-sm transition-colors w-full"
        >
          {dict.cart.checkout}
        </LocalizedLink>

        <LocalizedLink
          href="/products"
          locale={locale}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 font-semibold text-sm text-foreground hover:bg-secondary-soft hover:text-secondary transition-colors w-full"
        >
          <ArrowLeftIcon width={16} height={16} />
          {dict.cart.continueShopping}
        </LocalizedLink>
      </aside>
    </div>
  );
}