import { getData, sendData } from './http';

/** `ThemeModeColorsDto` — every value must be a hex colour. */
export interface ThemeModeColors {
  primary: string;
  primaryHover: string;
  primarySoft: string;
  secondary: string;
  secondarySoft: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  foreground: string;
  muted: string;
  border: string;
  buttonBg: string;
  buttonText: string;
  buttonHover: string;
  actionRed: string;
}

export const THEME_PALETTES = ['natural', 'emerald', 'sky', 'berry', 'amber', 'custom'] as const;
export const THEME_FONTS = ['inter', 'jakarta', 'outfit', 'playfair'] as const;
export type ThemePalette = (typeof THEME_PALETTES)[number];
export type ThemeFont = (typeof THEME_FONTS)[number];

/** Stored theme (`SettingsService.getTheme`). `brand` is passed through untouched. */
export interface ThemeSettings {
  palette: ThemePalette;
  fontFamily: ThemeFont;
  light: ThemeModeColors;
  dark: ThemeModeColors;
  brand?: Record<string, unknown>;
  updatedAt: string;
}

/** `UpdateThemeDto` — the server merges it into the stored theme. */
export type UpdateThemeInput = Partial<Pick<ThemeSettings, 'palette' | 'fontFamily' | 'light' | 'dark' | 'brand'>>;

export const fetchTheme = () => getData<ThemeSettings>('/settings/theme');
export const updateTheme = (input: UpdateThemeInput) => sendData<ThemeSettings>('put', '/settings/theme', input);
export const resetTheme = () => sendData<ThemeSettings>('delete', '/settings/theme');
