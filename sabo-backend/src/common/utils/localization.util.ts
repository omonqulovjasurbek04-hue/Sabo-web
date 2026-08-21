export interface TranslationRecord {
  locale: string;
  name?: string | null;
  title?: string | null;
  description?: string | null;
  shortDescription?: string | null;
  [key: string]: any;
}

export function pickTranslation<T extends TranslationRecord>(
  translations: T[] | undefined,
  requestedLocale: string,
  defaultLocale = 'uz',
): T | undefined {
  if (!translations || translations.length === 0) return undefined;

  // 1. Exact match for requested locale
  const match = translations.find((t) => t.locale === requestedLocale);
  if (match) return match;

  // 2. Default locale fallback
  const defaultMatch = translations.find((t) => t.locale === defaultLocale);
  if (defaultMatch) return defaultMatch;

  // 3. Any available translation
  return translations[0];
}
