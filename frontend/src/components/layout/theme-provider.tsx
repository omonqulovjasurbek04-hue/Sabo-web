"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ThemeSettings } from "@/lib/types";
import { apiClient } from "@/lib/api-client";

export type Theme = "light" | "dark";
export type ColorPalette = "natural" | "emerald" | "sky" | "berry" | "amber" | "custom";
export type FontFamily = "inter" | "jakarta" | "outfit" | "playfair";

interface ThemeContextValue {
  theme: Theme;
  palette: ColorPalette;
  fontFamily: FontFamily;
  themeSettings: ThemeSettings | null;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setPalette: (palette: ColorPalette) => void;
  setFontFamily: (font: FontFamily) => void;
  updateGlobalThemeSettings: (settings: Partial<ThemeSettings>) => Promise<ThemeSettings | null>;
  resetGlobalThemeSettings: () => Promise<ThemeSettings | null>;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_STORAGE_KEY = "sabo-theme";
const PALETTE_STORAGE_KEY = "sabo-palette";
const FONT_STORAGE_KEY = "sabo-font";

function applyThemeVariables(settings: ThemeSettings) {
  if (typeof document === "undefined") return;
  let styleEl = document.getElementById("sabo-dynamic-theme-vars");
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "sabo-dynamic-theme-vars";
    document.head.appendChild(styleEl);
  }

  const { light, dark } = settings;
  const css = `
    :root, [data-theme="light"] {
      --primary: ${light.primary} !important;
      --primary-hover: ${light.primaryHover} !important;
      --primary-soft: ${light.primarySoft} !important;
      --secondary: ${light.secondary} !important;
      --secondary-soft: ${light.secondarySoft} !important;
      --background: ${light.background} !important;
      --surface: ${light.surface} !important;
      --surface-elevated: ${light.surfaceElevated} !important;
      --foreground: ${light.foreground} !important;
      --muted: ${light.muted} !important;
      --border: ${light.border} !important;
      --action-red: ${light.actionRed} !important;
      --btn-primary-bg: ${light.buttonBg} !important;
      --btn-primary-text: ${light.buttonText} !important;
      --btn-primary-hover: ${light.buttonHover} !important;
    }
    .dark, [data-theme="dark"] {
      --primary: ${dark.primary} !important;
      --primary-hover: ${dark.primaryHover} !important;
      --primary-soft: ${dark.primarySoft} !important;
      --secondary: ${dark.secondary} !important;
      --secondary-soft: ${dark.secondarySoft} !important;
      --background: ${dark.background} !important;
      --surface: ${dark.surface} !important;
      --surface-elevated: ${dark.surfaceElevated} !important;
      --foreground: ${dark.foreground} !important;
      --muted: ${dark.muted} !important;
      --border: ${dark.border} !important;
      --action-red: ${dark.actionRed} !important;
      --btn-primary-bg: ${dark.buttonBg} !important;
      --btn-primary-text: ${dark.buttonText} !important;
      --btn-primary-hover: ${dark.buttonHover} !important;
    }
  `;
  styleEl.innerHTML = css;
}

export function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [palette, setPaletteState] = useState<ColorPalette>("natural");
  const [fontFamily, setFontFamilyState] = useState<FontFamily>("jakarta");
  const [themeSettings, setThemeSettings] = useState<ThemeSettings | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load global theme settings from backend
  const loadGlobalSettings = useCallback(async () => {
    try {
      const res = await apiClient.getThemeSettings();
      if (res.success && res.data) {
        setThemeSettings(res.data);
        if (res.data.palette) setPaletteState(res.data.palette);
        if (res.data.fontFamily) setFontFamilyState(res.data.fontFamily);
        applyThemeVariables(res.data);
      }
    } catch {
      // Fallback to local / default
    }
  }, []);

  useEffect(() => {
    const initialTheme = getInitialTheme();
    const initialPalette = (window.localStorage.getItem(PALETTE_STORAGE_KEY) as ColorPalette) || "natural";
    const initialFont = (window.localStorage.getItem(FONT_STORAGE_KEY) as FontFamily) || "jakarta";

    setThemeState(initialTheme);
    setPaletteState(initialPalette);
    setFontFamilyState(initialFont);

    document.documentElement.setAttribute("data-theme", initialTheme);
    document.documentElement.setAttribute("data-palette", initialPalette);
    document.documentElement.setAttribute("data-font", initialFont);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");

    setMounted(true);
    loadGlobalSettings();
  }, [loadGlobalSettings]);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-palette", palette);
    window.localStorage.setItem(PALETTE_STORAGE_KEY, palette);
  }, [palette, mounted]);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-font", fontFamily);
    window.localStorage.setItem(FONT_STORAGE_KEY, fontFamily);
  }, [fontFamily, mounted]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const setPalette = useCallback((next: ColorPalette) => {
    setPaletteState(next);
  }, []);

  const setFontFamily = useCallback((next: FontFamily) => {
    setFontFamilyState(next);
  }, []);

  const updateGlobalThemeSettings = useCallback(
    async (settings: Partial<ThemeSettings>): Promise<ThemeSettings | null> => {
      try {
        const res = await apiClient.updateThemeSettings(settings);
        if (res.success && res.data) {
          setThemeSettings(res.data);
          if (res.data.palette) setPaletteState(res.data.palette);
          if (res.data.fontFamily) setFontFamilyState(res.data.fontFamily);
          applyThemeVariables(res.data);
          return res.data;
        }
      } catch (err) {
        console.error("Failed to update global theme settings:", err);
      }
      return null;
    },
    []
  );

  const resetGlobalThemeSettings = useCallback(async (): Promise<ThemeSettings | null> => {
    try {
      const res = await apiClient.resetThemeSettings();
      if (res.success && res.data) {
        setThemeSettings(res.data);
        if (res.data.palette) setPaletteState(res.data.palette);
        if (res.data.fontFamily) setFontFamilyState(res.data.fontFamily);
        applyThemeVariables(res.data);
        return res.data;
      }
    } catch (err) {
      console.error("Failed to reset global theme settings:", err);
    }
    return null;
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        palette,
        fontFamily,
        themeSettings,
        setTheme,
        toggleTheme,
        setPalette,
        setFontFamily,
        updateGlobalThemeSettings,
        resetGlobalThemeSettings,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}