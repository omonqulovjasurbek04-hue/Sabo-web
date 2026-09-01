"use client";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { CartIcon } from "@/components/ui/icons";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";
import type { Product } from "@/lib/types";

interface AddToCartButtonProps {
  product: Product;
  locale: Locale;
  dict: Dictionary;
  size?: "md" | "lg";
}

export function AddToCartButton({
  product,
  dict,
  size = "lg",
}: AddToCartButtonProps) {
  const { addItem, notify } = useCart();

  const handleClick = () => {
    const variant = product.variants.find((v) => v.isDefault) || product.variants[0];
    if (!variant) return;
    addItem({
      id: variant.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      volume: variant.volume ?? "",
      fat: product.fat,
      price: variant.priceMinor != null ? variant.priceMinor / 100 : null,
    });
    notify(dict.cart.added);
  };

  return (
    <Button
      variant="primary"
      size={size}
      onClick={handleClick}
      className="gap-2 shadow-sm"
    >
      <CartIcon width={18} height={18} />
      {dict.cart.addToCart}
    </Button>
  );
}