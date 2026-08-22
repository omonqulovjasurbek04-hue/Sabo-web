"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/layout/theme-provider";
import { MoonIcon, SunIcon } from "@/components/ui/icons";
import type { Dictionary } from "@/lib/i18n/dictionary";

export function ThemeToggle({ dict }: { dict: Dictionary }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="inline-flex items-center justify-center size-10 rounded-full border border-border bg-surface text-foreground shadow-2xs opacity-80"
        aria-label="Theme"
      >
        <MoonIcon width={20} height={20} className="text-primary" />
      </button>
    );
  }

  const isDark = theme === "dark";
  const label = isDark ? dict.nav.themeLight : dict.nav.themeDark;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center justify-center size-10 rounded-full border border-border bg-surface text-foreground hover:border-primary hover:text-primary hover:bg-primary-soft transition-colors cursor-pointer shadow-2xs"
      aria-label={label}
      title={label}
    >
      {isDark ? (
        <SunIcon width={20} height={20} className="text-yellow-400" />
      ) : (
        <MoonIcon width={20} height={20} className="text-primary" />
      )}
    </button>
  );
}