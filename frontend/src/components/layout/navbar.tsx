"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { LocalizedLink } from "@/components/layout/localized-link";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Container } from "@/components/ui/container";
import {
  CartIcon,
  CloseIcon,
  MenuIcon,
  SearchIcon,
} from "@/components/ui/icons";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";

export function Navbar({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const drawerPanelRef = useRef<HTMLDivElement>(null);
  const { totalQuantity } = useCart();
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const links: Array<{ href: string; label: string }> = [
    { href: "/products", label: dict.nav.products },
    { href: "/production", label: dict.nav.production },
    { href: "/about", label: dict.nav.about },
    { href: "/certificates", label: dict.nav.certificates },
    { href: "/blog", label: dict.nav.blog },
    { href: "/contact", label: dict.nav.contact },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setIsScrolled(scrollTop > 10);
      if (docHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      const closeButton = drawerPanelRef.current?.querySelector<HTMLButtonElement>(
        'button[aria-label="' + dict.nav.close + '"]',
      );
      closeButton?.focus();
      return () => {
        document.body.style.overflow = "";
      };
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, dict.nav.close]);

  useEffect(() => {
    if (!menuOpen) return;
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !drawerPanelRef.current) return;
      const focusable = drawerPanelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", trapFocus);
    return () => document.removeEventListener("keydown", trapFocus);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) menuToggleRef.current?.focus();
  }, [menuOpen]);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/${locale}/products?q=${encodeURIComponent(trimmed)}`);
    }
    setSearchOpen(false);
  };

  // Hide website navbar when on admin dashboard
  if (pathname?.includes("/admin")) {
    return null;
  }

  return (
    <header
      className={`sticky top-0 z-50 bg-surface/85 backdrop-blur-[12px] border-b transition-all duration-300 ${
        isScrolled
          ? "border-border shadow-md dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
          : "border-border/40 shadow-none"
      }`}
    >
      {/* Scroll indicator - appears when scrolled down */}
      <div
        className={`absolute top-0 left-0 h-[2.5px] bg-action-red transition-all duration-150 pointer-events-none z-50 ${
          isScrolled ? "opacity-100 shadow-[0_2px_12px_rgba(199,25,37,0.6)]" : "opacity-0"
        }`}
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />
      <Container className="flex items-center justify-between gap-6 h-[var(--header-height)]">
        <LocalizedLink
          href="/"
          locale={locale}
          className="inline-flex items-center shrink-0"
          aria-label="SABO"
        >
          <Image
            src="/images/logo.png"
            alt="SABO"
            width={1230}
            height={678}
            className="w-auto h-10 lg:h-11 object-contain"
            priority
          />
        </LocalizedLink>

        <nav className="hidden lg:flex items-center gap-1" aria-label={dict.nav.menu}>
          {links.map((link) => (
            <LocalizedLink
              key={link.href}
              href={link.href}
              locale={locale}
              className="px-3 py-2 rounded-lg text-[15px] font-medium text-muted hover:text-action-red hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              {link.label}
            </LocalizedLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {searchOpen ? (
            <form className="flex items-center gap-2" onSubmit={submitSearch} role="search">
              <input
                ref={searchRef}
                type="search"
                className="w-[min(260px,40vw)] px-4 py-2 text-sm border border-border-strong rounded-full bg-background text-foreground focus:outline-none focus:border-action-red focus:ring-2 focus:ring-action-red/20"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={dict.nav.searchPlaceholder}
                aria-label={dict.nav.search}
              />
              <button
                type="button"
                className="inline-flex items-center justify-center size-10 rounded-full border border-border bg-surface text-muted hover:text-action-red hover:border-action-red transition-colors"
                onClick={() => setSearchOpen(false)}
                aria-label={dict.nav.close}
              >
                <CloseIcon width={20} height={20} />
              </button>
            </form>
          ) : (
            <button
              type="button"
              className="inline-flex items-center justify-center size-10 rounded-full border border-border bg-surface text-muted hover:text-action-red hover:border-action-red transition-colors"
              onClick={() => setSearchOpen(true)}
              aria-label={dict.nav.search}
              title={dict.nav.search}
            >
              <SearchIcon width={20} height={20} />
            </button>
          )}

          <LocaleSwitcher locale={locale} dict={dict} />

          <ThemeToggle dict={dict} />

          <LocalizedLink
            href="/cart"
            locale={locale}
            className="relative inline-flex items-center justify-center size-10 rounded-full border border-border bg-surface text-muted hover:text-action-red hover:border-action-red transition-colors"
            aria-label={dict.nav.cart}
            title={dict.nav.cart}
          >
            <CartIcon width={20} height={20} />
            {mounted && totalQuantity > 0 ? (
              <span
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-action-red text-white text-[11px] font-bold inline-flex items-center justify-center shadow-xs"
                aria-hidden="true"
              >
                {totalQuantity}
              </span>
            ) : null}
          </LocalizedLink>

          <button
            type="button"
            className="inline-flex lg:hidden items-center justify-center size-10 rounded-full border border-border bg-surface text-muted hover:text-secondary hover:bg-secondary-soft hover:border-secondary transition-colors"
            onClick={() => setMenuOpen(true)}
            aria-label={dict.nav.menu}
            aria-expanded={menuOpen}
            ref={menuToggleRef}
          >
            <MenuIcon width={24} height={24} />
          </button>
        </div>
      </Container>

      {menuOpen ? (
        <div className="fixed inset-0 z-100" role="dialog" aria-modal="true" aria-label={dict.nav.menu}>
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-xs cursor-pointer w-full h-full border-none"
            onClick={() => setMenuOpen(false)}
            aria-label={dict.nav.close}
          />
          <div
            className="absolute top-0 right-0 h-full w-[min(360px,85vw)] bg-surface shadow-2xl flex flex-col overflow-y-auto border-l border-border transition-transform"
            ref={drawerPanelRef}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <Image
                src="/images/logo.png"
                alt="SABO"
                width={1230}
                height={678}
                className="w-auto h-9 object-contain"
              />
              <button
                type="button"
                className="inline-flex items-center justify-center size-10 rounded-full border border-border bg-surface text-muted hover:text-secondary hover:bg-secondary-soft hover:border-secondary transition-colors"
                onClick={() => setMenuOpen(false)}
                aria-label={dict.nav.close}
              >
                <CloseIcon width={24} height={24} />
              </button>
            </div>

            <nav className="flex flex-col p-3 flex-1" aria-label={dict.nav.menu}>
              {[{ href: "/", label: dict.nav.home }, ...links].map((link) => (
                <LocalizedLink
                  key={link.href}
                  href={link.href}
                  locale={locale}
                  className="px-4 py-3.5 rounded-lg text-base font-medium text-foreground hover:bg-secondary-soft hover:text-secondary transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </LocalizedLink>
              ))}
            </nav>

            <div className="flex flex-col gap-5 p-6 border-t border-border bg-surface-soft/40">
              <LocaleSwitcher locale={locale} dict={dict} variant="mobile" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                  {dict.nav.theme}
                </span>
                <ThemeToggle dict={dict} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}