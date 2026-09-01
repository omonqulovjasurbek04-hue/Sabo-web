import { Injectable } from "@nestjs/common";
import { SettingType } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateThemeDto } from "./dto/update-theme.dto";

// NOTE: the Prisma schema does not have a dedicated `SiteSettings` model with
// theme/color columns (only a generic key/value `SiteSetting` model exists,
// already used for site_name / default_locale / etc in prisma/seed.ts). This
// module stores the theme payload as a single JSON blob under the
// `THEME_SETTING_KEY` key in that same table rather than introducing a new
// migration, since it should only ever be one row.
const THEME_SETTING_KEY = "theme";

const DEFAULT_THEME_COLORS = {
  primary: "#0f766e",
  primaryHover: "#0d6660",
  primarySoft: "#ccfbf1",
  secondary: "#f59e0b",
  secondarySoft: "#fef3c7",
  background: "#ffffff",
  surface: "#f9fafb",
  surfaceElevated: "#ffffff",
  foreground: "#111827",
  muted: "#6b7280",
  border: "#e5e7eb",
  buttonBg: "#0f766e",
  buttonText: "#ffffff",
  buttonHover: "#0d6660",
  actionRed: "#dc2626",
};

const DEFAULT_THEME = {
  palette: "natural" as const,
  fontFamily: "inter" as const,
  light: DEFAULT_THEME_COLORS,
  dark: DEFAULT_THEME_COLORS,
  brand: {},
  updatedAt: new Date(0).toISOString(),
};

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTheme() {
    const setting = await this.prisma.siteSetting.findUnique({
      where: { key: THEME_SETTING_KEY },
    });

    if (!setting) {
      return DEFAULT_THEME;
    }

    try {
      return JSON.parse(setting.value);
    } catch {
      return DEFAULT_THEME;
    }
  }

  async updateTheme(dto: UpdateThemeDto) {
    const current = await this.getTheme();
    const merged = {
      ...current,
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    await this.prisma.siteSetting.upsert({
      where: { key: THEME_SETTING_KEY },
      update: {
        value: JSON.stringify(merged),
        type: SettingType.JSON,
        isPublic: true,
      },
      create: {
        key: THEME_SETTING_KEY,
        value: JSON.stringify(merged),
        type: SettingType.JSON,
        isPublic: true,
      },
    });

    return merged;
  }

  async resetTheme() {
    await this.prisma.siteSetting.deleteMany({ where: { key: THEME_SETTING_KEY } });
    return DEFAULT_THEME;
  }
}
