"use client";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { CartIcon } from "@/components/ui/icons";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";
import { localize, type Product } from "@/lib/types";

interface AddToCartButtonProps {
  product: Product;
  locale: Locale;
  dict: Dictionary;
  size?: "md" | "lg";
}

export function AddToCartButton({
  product,
  locale,
  dict,
  size = "lg",
}: AddToCartButtonProps) {
  const { addItem, notify } = useCart();

  const handleClick = () => {
    addItem({
      id: product.id,
      slug: product.slug,
      name: localize(product.name, locale),
      image: product.image,
      volume: product.volumes[0] ?? "",
      fat: product.fat,
      price: product.price,
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