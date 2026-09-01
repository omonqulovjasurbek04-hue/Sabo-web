import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsIn,
  IsObject,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { ThemeModeColorsDto } from "./theme-mode-colors.dto";

const PALETTES = [
  "natural",
  "emerald",
  "sky",
  "berry",
  "amber",
  "custom",
] as const;
const FONT_FAMILIES = ["inter", "jakarta", "outfit", "playfair"] as const;

// Partial<ThemeSettings> from the frontend (see frontend/src/lib/types.ts).
// `brand` intentionally stays loosely typed (logo/video URLs, banner text,
// add-ons catalog) to keep this module small — it is passed through as-is.
export class UpdateThemeDto {
  @ApiPropertyOptional({ enum: PALETTES })
  @IsOptional()
  @IsIn(PALETTES)
  palette?: (typeof PALETTES)[number];

  @ApiPropertyOptional({ enum: FONT_FAMILIES })
  @IsOptional()
  @IsIn(FONT_FAMILIES)
  fontFamily?: (typeof FONT_FAMILIES)[number];

  @ApiPropertyOptional({ type: ThemeModeColorsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ThemeModeColorsDto)
  light?: ThemeModeColorsDto;

  @ApiPropertyOptional({ type: ThemeModeColorsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ThemeModeColorsDto)
  dark?: ThemeModeColorsDto;

  @ApiPropertyOptional({
    description:
      "Brand assets & misc settings (logo/video URLs, banner text, add-ons catalog)",
  })
  @IsOptional()
  @IsObject()
  brand?: Record<string, unknown>;
}
