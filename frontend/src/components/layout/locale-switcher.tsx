"use client";

import { useEffect, useRef, useState } from "react";

import { ChevronDownIcon, GlobeIcon } from "@/components/ui/icons";
import { locales, type Locale } from "@/lib/i18n/locales";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { cn } from "@/lib/utils";

interface LocaleSwitcherProps {
  locale: Locale;
  dict: Dictionary;
  variant?: "desktop" | "mobile";
}

export function LocaleSwitcher({
  locale,
  dict,
  variant = "desktop",
}: LocaleSwitcherProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const label = locale.toUpperCase();

  const handleSelectLocale = (newLocale: Locale) => {
    if (newLocale === locale) {
      setOpen(false);
      return;
    }
    // Set 1-year cookie for Next.js middleware
    document.cookie = `sabo_locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    if (typeof window !== "undefined") {
      window.localStorage.setItem("sabo_locale", newLocale);
      // Reload on clean URL
      window.location.reload();
    }
  };

  useEffect(() => {
    if (!open || variant === "mobile") return;
    const close = (event: KeyboardEvent | MouseEvent) => {
      if (event instanceof KeyboardEvent) {
        if (event.key === "Escape") setOpen(false);
        return;
      }
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", close);
    document.addEventListener("mousedown", close);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("mousedown", close);
    };
  }, [open, variant]);

  if (variant === "mobile") {
    return (
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted text-center">
          {dict.nav.language}
        </span>
        <div className="flex items-center gap-1 bg-surface border border-border p-1 rounded-xl shadow-2xs">
          {locales.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleSelectLocale(item)}
              className={cn(
                "px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center",
                item === locale
                  ? "bg-primary text-white shadow-xs"
                  : "text-muted hover:text-foreground hover:bg-surface-elevated"
              )}
              aria-current={item === locale ? "true" : undefined}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        className="inline-flex items-center justify-center gap-1.5 px-3 h-10 rounded-full border border-border bg-surface text-muted hover:border-secondary hover:text-secondary hover:bg-secondary-soft transition-colors cursor-pointer"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={dict.nav.language}
        title={dict.nav.language}
      >
        <GlobeIcon width={18} height={18} />
        <span className="text-xs font-bold">{label}</span>
        <ChevronDownIcon width={14} height={14} />
      </button>

      {open ? (
        <div
          className="absolute top-[calc(100%+8px)] right-0 min-w-[120px] p-1.5 rounded-xl border border-border bg-surface shadow-lg z-60 animate-in fade-in zoom-in-95 duration-150"
          role="listbox"
          aria-label={dict.nav.language}
        >
          {locales.map((item) => (
            <button
              key={item}
              type="button"
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer",
                item === locale
                  ? "text-primary bg-primary-soft font-bold"
                  : "text-muted hover:bg-secondary-soft hover:text-secondary"
              )}
              role="option"
              aria-selected={item === locale}
              onClick={() => handleSelectLocale(item)}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}