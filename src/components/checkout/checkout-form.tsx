"use client";

import { useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { LocalizedLink } from "@/components/layout/localized-link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CheckIcon } from "@/components/ui/icons";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";
import { cn, formatPrice } from "@/lib/utils";

interface CheckoutFormProps {
  dict: Dictionary;
  locale: Locale;
}

type Values = {
  name: string;
  phone: string;
  email: string;
  address: string;
};

type Errors = Partial<Record<keyof Values, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9\s\-()]{7,17}$/;

export function CheckoutForm({ dict, locale }: CheckoutFormProps) {
  const { items, subtotal, hasPrices } = useCart();
  const [values, setValues] = useState<Values>({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const setField = (field: keyof Values, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

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

  const validate = (): Errors => {
    const next: Errors = {};
    if (!values.name.trim()) next.name = dict.contact.validation.required;
    if (!values.phone.trim()) {
      next.phone = dict.contact.validation.required;
    } else if (!PHONE_PATTERN.test(values.phone.trim())) {
      next.phone = dict.contact.validation.phone;
    }
    if (!values.email.trim()) {
      next.email = dict.contact.validation.required;
    } else if (!EMAIL_PATTERN.test(values.email.trim())) {
      next.email = dict.contact.validation.email;
    }
    if (!values.address.trim()) next.address = dict.contact.validation.required;
    return next;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-start gap-4 p-8 sm:p-10 rounded-2xl border border-border bg-surface shadow-xs max-w-xl mx-auto">
        <span
          className="inline-flex items-center justify-center size-14 rounded-2xl bg-accent-soft text-accent"
          aria-hidden="true"
        >
          <CheckIcon width={28} height={28} />
        </span>
        <h2 className="font-sans font-bold text-2xl text-foreground">
          {dict.checkout.orderSummary}
        </h2>
        <p className="text-muted text-base leading-relaxed">{dict.checkout.notSent}</p>
        <LocalizedLink
          href="/cart"
          locale={locale}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-sm border border-border-strong bg-surface text-foreground hover:border-secondary hover:text-secondary transition-colors mt-2"
        >
          {dict.checkout.backToCart}
        </LocalizedLink>
      </div>
    );
  }

  const inputClass = (field: keyof Values) =>
    cn(
      "w-full px-4 py-3 rounded-xl border bg-surface text-foreground text-sm sm:text-base outline-none transition-all placeholder:text-muted",
      errors[field]
        ? "border-primary ring-2 ring-primary-soft"
        : "border-border-strong focus:border-secondary focus:ring-2 focus:ring-secondary-soft"
    );

  return (
    <form className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 items-start" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-5 p-6 sm:p-7 rounded-2xl border border-border bg-surface shadow-xs">
          <h2 className="font-sans font-bold text-lg text-foreground">{dict.checkout.customer}</h2>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-foreground" htmlFor="checkout-name">
              {dict.contact.name}
            </label>
            <input
              id="checkout-name"
              type="text"
              placeholder={dict.contact.namePlaceholder}
              className={inputClass("name")}
              value={values.name}
              onChange={(e) => setField("name", e.target.value)}
              aria-invalid={errors.name ? true : undefined}
            />
            {errors.name ? (
              <span className="text-xs text-primary font-medium" role="alert">
                {errors.name}
              </span>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-foreground" htmlFor="checkout-phone">
              {dict.contact.phone}
            </label>
            <input
              id="checkout-phone"
              type="tel"
              placeholder={dict.contact.phonePlaceholder}
              className={inputClass("phone")}
              value={values.phone}
              onChange={(e) => setField("phone", e.target.value)}
              aria-invalid={errors.phone ? true : undefined}
            />
            {errors.phone ? (
              <span className="text-xs text-primary font-medium" role="alert">
                {errors.phone}
              </span>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-foreground" htmlFor="checkout-email">
              {dict.contact.email}
            </label>
            <input
              id="checkout-email"
              type="email"
              placeholder={dict.contact.emailPlaceholder}
              className={inputClass("email")}
              value={values.email}
              onChange={(e) => setField("email", e.target.value)}
              aria-invalid={errors.email ? true : undefined}
            />
            {errors.email ? (
              <span className="text-xs text-primary font-medium" role="alert">
                {errors.email}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-5 p-6 sm:p-7 rounded-2xl border border-border bg-surface shadow-xs">
          <h2 className="font-sans font-bold text-lg text-foreground">{dict.checkout.address}</h2>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-foreground" htmlFor="checkout-address">
              {dict.checkout.address}
            </label>
            <textarea
              id="checkout-address"
              rows={3}
              placeholder={dict.checkout.addressPlaceholder}
              className={inputClass("address")}
              value={values.address}
              onChange={(e) => setField("address", e.target.value)}
              aria-invalid={errors.address ? true : undefined}
            />
            {errors.address ? (
              <span className="text-xs text-primary font-medium" role="alert">
                {errors.address}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-3 p-6 sm:p-7 rounded-2xl border border-border bg-surface shadow-xs">
          <h2 className="font-sans font-bold text-lg text-foreground">{dict.checkout.paymentTitle}</h2>
          <p className="text-xs sm:text-sm p-3.5 rounded-xl bg-surface-soft text-secondary leading-relaxed">
            {dict.checkout.paymentNote}
          </p>
        </div>
      </div>

      <aside className="p-6 sm:p-7 rounded-2xl border border-border bg-surface shadow-xs sticky top-[calc(var(--header-height)+24px)] flex flex-col gap-5">
        <h2 className="font-sans font-bold text-xl text-foreground">{dict.checkout.orderSummary}</h2>

        <ul className="list-none p-0 flex flex-col gap-3 m-0">
          {items.map((line) => (
            <li key={line.id} className="flex justify-between gap-4 text-sm sm:text-base">
              <span className="text-foreground">
                {line.name}
                {line.quantity > 1 ? (
                  <span className="text-muted ml-1.5 font-normal">
                    × {line.quantity}
                  </span>
                ) : null}
              </span>
              <span className="font-semibold whitespace-nowrap">
                {line.price !== null
                  ? formatPrice(line.price * line.quantity, locale)
                  : "—"}
              </span>
            </li>
          ))}
        </ul>

        {hasPrices ? (
          <div className="flex justify-between border-t border-border pt-4 text-lg font-bold text-foreground">
            <span>{dict.cart.total}</span>
            <strong>{subtotal !== null ? formatPrice(subtotal, locale) : "—"}</strong>
          </div>
        ) : (
          <p className="text-xs sm:text-sm p-3.5 rounded-xl bg-surface-soft text-secondary">
            {dict.cart.priceNote}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full font-bold">
          {dict.checkout.submitOrder}
        </Button>
      </aside>
    </form>
  );
}