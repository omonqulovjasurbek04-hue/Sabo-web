import type { Locale } from "@/lib/i18n/locales";
import uz from "@/locales/uz";
import ru from "@/locales/ru";
import en from "@/locales/en";

type DeepStringify<T> = {
  readonly [K in keyof T]: T[K] extends readonly (infer U)[]
    ? readonly DeepStringify<U>[]
    : T[K] extends object
      ? DeepStringify<T[K]>
      : string;
};

export type Dictionary = DeepStringify<typeof uz>;

const dictionaries: Record<Locale, Dictionary> = { uz, ru, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}