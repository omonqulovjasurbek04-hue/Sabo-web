import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { defaultLocale, locales, type Locale } from "@/lib/i18n/locales";

function getSavedLocale(request: NextRequest): Locale {
  // 1. Check sabo_locale cookie
  const cookieLocale = request.cookies.get("sabo_locale")?.value as Locale;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // 2. Check accept-language header
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const preferred = acceptLanguage
      .split(",")
      .map((part) => part.split(";")[0].trim().toLowerCase())
      .find((lang) =>
        locales.some(
          (locale) => lang === locale || lang.startsWith(`${locale}-`),
        ),
      );
    if (preferred) {
      const match = locales.find(
        (locale) =>
          preferred === locale || preferred.startsWith(`${locale}-`),
      );
      if (match) return match;
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if URL explicitly has a locale prefix (e.g. /uz, /ru, /en, /uz/products, etc.)
  const matchedLocale = locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (matchedLocale) {
    // URL has an explicit locale: serve content directly (200 OK) and save locale in cookie
    const response = NextResponse.next();
    if (request.cookies.get("sabo_locale")?.value !== matchedLocale) {
      response.cookies.set("sabo_locale", matchedLocale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
    return response;
  }

  // Clean unprefixed URL (e.g. /, /products, /about, /cart)
  const locale = getSavedLocale(request);

  // Internally rewrite to the [locale] dynamic route without changing the browser URL
  const rewriteUrl = new URL(`/${locale}${pathname === "/" ? "" : pathname}`, request.url);
  rewriteUrl.search = request.nextUrl.search;

  const response = NextResponse.rewrite(rewriteUrl);

  // Ensure cookie is persisted
  if (!request.cookies.has("sabo_locale")) {
    response.cookies.set("sabo_locale", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|video|icons|favicon.ico|.*\\..*).*)",
  ],
};