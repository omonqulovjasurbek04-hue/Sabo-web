import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale } from "@/lib/i18n/locales";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number, locale: Locale): string {
  return new Intl.NumberFormat(
    locale === "en" ? "en-US" : locale === "ru" ? "ru-RU" : "uz-UZ",
    { style: "currency", currency: "UZS", maximumFractionDigits: 0 },
  ).format(value);
}

export function formatResultsCount(count: number, single: string, few: string, many: string, zero?: string): string {
  if (count === 0 && zero) return zero;
  const abs = Math.abs(count) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (last > 1 && last < 5) return few;
  if (last === 1) return single;
  return many;
}
