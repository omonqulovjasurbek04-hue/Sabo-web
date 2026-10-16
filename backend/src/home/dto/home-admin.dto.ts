import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";
import { IsOptionalNotNull } from "../../common/cms/cms.util";

/** Site-relative path (`/products`) or absolute https URL. */
const SAFE_HREF = /^(\/(?!\/)[^\s]*|https:\/\/[^\s]+)$/;

export class HomeButtonDto {
  @ApiProperty({ example: "Mahsulotlar", maxLength: 60 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  label!: string;

  @ApiProperty({ example: "/products", maxLength: 500 })
  @IsString()
  @Matches(SAFE_HREF, {
    message: "href must be a site-relative path or an https URL",
  })
  @MaxLength(500)
  href!: string;
}

export class CreateHomeHeroDto {
  @ApiProperty({ maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({ maxLength: 300, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  subtitle?: string | null;

  @ApiPropertyOptional({ maxLength: 2000, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string | null;

  @ApiPropertyOptional({ type: HomeButtonDto, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => HomeButtonDto)
  primaryButton?: HomeButtonDto | null;

  @ApiPropertyOptional({ type: HomeButtonDto, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => HomeButtonDto)
  secondaryButton?: HomeButtonDto | null;

  @ApiPropertyOptional({ format: "uuid", nullable: true })
  @IsOptional()
  @IsUUID()
  backgroundImageId?: string | null;

  @ApiPropertyOptional({ format: "uuid", nullable: true })
  @IsOptional()
  @IsUUID()
  productImageId?: string | null;

  @ApiPropertyOptional({ default: 0 })
  @IsOptionalNotNull()
  @IsInt()
  @Min(0)
  @Max(10_000)
  sortOrder?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptionalNotNull()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateHomeHeroDto {
  @ApiPropertyOptional({ maxLength: 200 })
  @IsOptionalNotNull()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({ maxLength: 300, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  subtitle?: string | null;

  @ApiPropertyOptional({ maxLength: 2000, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string | null;

  @ApiPropertyOptional({ type: HomeButtonDto, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => HomeButtonDto)
  primaryButton?: HomeButtonDto | null;

  @ApiPropertyOptional({ type: HomeButtonDto, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => HomeButtonDto)
  secondaryButton?: HomeButtonDto | null;

  @ApiPropertyOptional({ format: "uuid", nullable: true })
  @IsOptional()
  @IsUUID()
  backgroundImageId?: string | null;

  @ApiPropertyOptional({ format: "uuid", nullable: true })
  @IsOptional()
  @IsUUID()
  productImageId?: string | null;

  @ApiPropertyOptional()
  @IsOptionalNotNull()
  @IsInt()
  @Min(0)
  @Max(10_000)
  sortOrder?: number;
}

export class CreateHomeSectionDto {
  @ApiProperty({
    example: "benefits",
    maxLength: 50,
    description: "Section kind key used by the frontend renderer",
  })
  @IsString()
  @Matches(/^[a-z][a-z0-9_-]*$/, {
    message: "type must be a lowercase key (a-z, 0-9, _ or -)",
  })
  @MaxLength(50)
  type!: string;

  @ApiProperty({ maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({ maxLength: 2000, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string | null;

  @ApiPropertyOptional({ format: "uuid", nullable: true })
  @IsOptional()
  @IsUUID()
  imageId?: string | null;

  @ApiPropertyOptional({ default: 0 })
  @IsOptionalNotNull()
  @IsInt()
  @Min(0)
  @Max(10_000)
  sortOrder?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptionalNotNull()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    type: "object",
    additionalProperties: true,
    nullable: true,
    description: "Free-form JSON for the section renderer",
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown> | null;
}

export class UpdateHomeSectionDto {
  @ApiPropertyOptional({ maxLength: 50 })
  @IsOptionalNotNull()
  @IsString()
  @Matches(/^[a-z][a-z0-9_-]*$/, {
    message: "type must be a lowercase key (a-z, 0-9, _ or -)",
  })
  @MaxLength(50)
  type?: string;

  @ApiPropertyOptional({ maxLength: 200 })
  @IsOptionalNotNull()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({ maxLength: 2000, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string | null;

  @ApiPropertyOptional({ format: "uuid", nullable: true })
  @IsOptional()
  @IsUUID()
  imageId?: string | null;

  @ApiPropertyOptional()
  @IsOptionalNotNull()
  @IsInt()
  @Min(0)
  @Max(10_000)
  sortOrder?: number;

  @ApiPropertyOptional({
    type: "object",
    additionalProperties: true,
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown> | null;
}
