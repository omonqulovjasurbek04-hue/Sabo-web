import type { Metadata } from "next";

import { getDictionary } from "@/lib/i18n/dictionary";
import { defaultLocale, locales, type Locale } from "@/lib/i18n/locales";

// JSON.stringify doesn't escape "<", so a product name/description containing
// a literal "</script>" would break out of the JSON-LD block into the page.
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

interface PageMetadataOptions {
  locale: Locale;
  path: string;
  title?: string;
  description?: string;
  image?: string;
}

export function generatePageMetadata({
  locale,
  path,
  title,
  description,
  image,
}: PageMetadataOptions): Metadata {
  const dict = getDictionary(locale);
  const localizedPath = (l: Locale) => `/${l}${path === "/" ? "" : path}`;

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = localizedPath(l);
  }
  languages["x-default"] = localizedPath(defaultLocale);

  const resolvedTitle = title ?? dict.meta.title;
  const resolvedDescription = description ?? dict.meta.description;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: {
      canonical: localizedPath(locale),
      languages,
    },
    openGraph: {
      locale,
      siteName: "SABO",
      title: resolvedTitle,
      description: resolvedDescription,
      url: localizedPath(locale),
      images: image ? [{ url: image, width: 1200, height: 630, alt: resolvedTitle }] : undefined,
    },
  };
}