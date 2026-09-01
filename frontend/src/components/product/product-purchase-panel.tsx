"use client";

import { useState } from "react";
import { ShoppingCart, Plus, Minus, Check, Sparkles } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { ProductAddOns } from "@/components/product/product-add-ons";
import { LocalizedLink } from "@/components/layout/localized-link";
import type { Product, ProductAddOn, ProductVariantInfo } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";
import { formatPrice } from "@/lib/utils";

interface ProductPurchasePanelProps {
  product: Product;
  locale: Locale;
  dict: Dictionary;
}

export function ProductPurchasePanel({
  product,
  locale,
  dict,
}: ProductPurchasePanelProps) {
  const { addItem, notify } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantInfo | null>(
    product.variants.find((v) => v.isDefault) || product.variants[0] || null
  );
  const [selectedAddOns, setSelectedAddOns] = useState<ProductAddOn[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const unitPrice = selectedVariant?.priceMinor != null ? selectedVariant.priceMinor / 100 : 0;
  const addOnsTotal = selectedAddOns.reduce((sum, item) => sum + item.price, 0);
  const totalItemPrice = (unitPrice + addOnsTotal) * quantity;

  const handleToggleAddOn = (addOn: ProductAddOn) => {
    setSelectedAddOns((prev) =>
      prev.some((a) => a.id === addOn.id)
        ? prev.filter((a) => a.id !== addOn.id)
        : [...prev, addOn]
    );
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem({
      id: selectedVariant.id,
      slug: product.slug,
      name: `${product.name}${selectedAddOns.length > 0 ? ` (+${selectedAddOns.length} qo'shimcha)` : ""}`,
      image: product.image,
      volume: selectedVariant.volume ?? "",
      fat: product.fat,
      price: unitPrice + addOnsTotal,
      quantity,
    });

    notify(`${product.name} ${dict.cart.added}`);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Volume Selector */}
      {product.variants.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-extrabold uppercase tracking-wider text-muted">
            {dict.product.volume}
          </label>
          <div className="flex gap-2.5 flex-wrap">
            {product.variants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;
              return (
                <button
                  key={variant.id}
                  type="button"
                  disabled={!variant.isAvailable}
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                    isSelected
                      ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                      : "bg-surface border border-border text-foreground hover:border-primary/40"
                  }`}
                >
                  {variant.volume}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Add-ons & Extra Options */}
      <ProductAddOns
        addOns={product.addOns}
        selectedAddOns={selectedAddOns}
        onToggleAddOn={handleToggleAddOn}
        locale={locale}
      />

      {/* Total Price & Quantity Counter */}
      <div className="p-5 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-xs font-bold text-muted uppercase tracking-wider block">
            Jami summa
          </span>
          <span className="text-2xl sm:text-3xl font-black font-display text-action-red">
            {formatPrice(totalItemPrice, locale)}
          </span>
          {addOnsTotal > 0 && (
            <span className="text-[11px] text-muted font-medium block mt-0.5">
              Mahsulot: {formatPrice(unitPrice * quantity, locale)} + Qo&apos;shimchalar: {formatPrice(addOnsTotal * quantity, locale)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-border rounded-xl bg-background p-1">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="size-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
              title="Kamaytirish"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="w-9 text-center font-bold text-sm text-foreground">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="size-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
              title="Ko'paytirish"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`flex-1 min-w-[200px] flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl font-bold text-sm sm:text-base text-white shadow-lg transition-all active:scale-[0.98] cursor-pointer ${
            isAdded
              ? "bg-emerald-600 shadow-emerald-600/20"
              : "bg-primary shadow-primary/20 hover:bg-primary-hover"
          }`}
        >
          {isAdded ? (
            <>
              <Check className="size-5" />
              <span>Savatga qo&apos;shildi!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="size-5" />
              <span>{dict.cart.addToCart}</span>
            </>
          )}
        </button>

        <LocalizedLink
          href="/contact"
          locale={locale}
          className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-bold text-sm sm:text-base border border-border-strong bg-surface text-foreground hover:border-primary hover:text-primary transition-colors shrink-0"
        >
          <Sparkles className="size-4" />
          <span>{dict.contact.title}</span>
        </LocalizedLink>
      </div>
    </div>
  );
}
