"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n/locales";
import { getLocalizedPath } from "@/lib/i18n/navigation";

interface LocalizedLinkProps
  extends Omit<React.ComponentProps<typeof Link>, "href"> {
  href: string;
  locale: Locale;
}

export function LocalizedLink({
  href,
  locale,
  prefetch = true,
  onMouseEnter,
  onTouchStart,
  ...props
}: LocalizedLinkProps) {
  const router = useRouter();
  const targetPath = getLocalizedPath(locale, href);

  const handlePrefetch = () => {
    if (prefetch) {
      router.prefetch(targetPath);
    }
  };

  return (
    <Link
      href={targetPath}
      prefetch={prefetch}
      onMouseEnter={(e) => {
        handlePrefetch();
        onMouseEnter?.(e);
      }}
      onTouchStart={(e) => {
        handlePrefetch();
        onTouchStart?.(e);
      }}
      {...props}
    />
  );
}

export function localizedHref(locale: Locale, href: string): string {
  return getLocalizedPath(locale, href);
}