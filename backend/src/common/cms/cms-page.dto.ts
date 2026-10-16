import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from "class-validator";
import {
  IsOptionalNotNull,
  SUPPORTED_LOCALES,
  SupportedLocale,
} from "./cms.util";

/** Translation row shape shared by `AboutTranslation` and `ProductionTranslation`. */
export class PageTranslationDto {
  @ApiProperty({ enum: SUPPORTED_LOCALES, example: "uz" })
  @IsIn(SUPPORTED_LOCALES)
  locale!: SupportedLocale;

  @ApiPropertyOptional({ maxLength: 200, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string | null;

  @ApiPropertyOptional({ maxLength: 5000, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string | null;
}

/** Singleton CMS page (about / production) hero + translations. */
export class UpsertCmsPageDto {
  @ApiPropertyOptional({
    maxLength: 200,
    nullable: true,
    description: "Fallback hero title when no translation matches",
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  heroTitle?: string | null;

  @ApiPropertyOptional({ maxLength: 5000, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  heroDescription?: string | null;

  @ApiPropertyOptional({ format: "uuid", nullable: true })
  @IsOptional()
  @IsUUID()
  heroImageId?: string | null;

  @ApiPropertyOptional({
    type: [PageTranslationDto],
    description: "Upserted per locale; locales not listed are left unchanged",
  })
  @IsOptionalNotNull()
  @IsArray()
  @ArrayMaxSize(SUPPORTED_LOCALES.length)
  @ValidateNested({ each: true })
  @Type(() => PageTranslationDto)
  translations?: PageTranslationDto[];
}
