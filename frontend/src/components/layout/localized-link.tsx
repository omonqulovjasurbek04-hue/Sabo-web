import Link from "next/link";
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
  ...props
}: LocalizedLinkProps) {
  return <Link href={getLocalizedPath(locale, href)} {...props} />;
}

export function localizedHref(locale: Locale, href: string): string {
  return getLocalizedPath(locale, href);
}