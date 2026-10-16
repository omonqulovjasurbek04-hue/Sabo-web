import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { BlogStatus } from "@prisma/client";
import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  ValidateNested,
} from "class-validator";
import {
  IsOptionalNotNull,
  SLUG_PATTERN,
  SUPPORTED_LOCALES,
  SupportedLocale,
} from "../../common/cms/cms.util";
import { PaginationQueryDto } from "../../common/dto/pagination.dto";

export class BlogPostTranslationDto {
  @ApiProperty({ enum: SUPPORTED_LOCALES, example: "uz" })
  @IsIn(SUPPORTED_LOCALES)
  locale!: SupportedLocale;

  @ApiProperty({ maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({ maxLength: 500, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  excerpt?: string | null;

  @ApiProperty({ description: "Post body (markdown / sanitized HTML)" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100_000)
  content!: string;

  @ApiPropertyOptional({ maxLength: 200, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  seoTitle?: string | null;

  @ApiPropertyOptional({ maxLength: 400, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(400)
  seoDescription?: string | null;
}

export class CreateBlogPostDto {
  @ApiProperty({ example: "sut-foydalari" })
  @IsString()
  @Matches(SLUG_PATTERN, { message: "slug must be kebab-case (a-z, 0-9, -)" })
  @MaxLength(160)
  slug!: string;

  @ApiPropertyOptional({ format: "uuid", nullable: true })
  @IsOptional()
  @IsUUID()
  categoryId?: string | null;

  @ApiPropertyOptional({ format: "uuid", nullable: true })
  @IsOptional()
  @IsUUID()
  coverImageId?: string | null;

  @ApiProperty({ type: [BlogPostTranslationDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(SUPPORTED_LOCALES.length)
  @ValidateNested({ each: true })
  @Type(() => BlogPostTranslationDto)
  translations!: BlogPostTranslationDto[];
}

export class UpdateBlogPostDto {
  @ApiPropertyOptional({ example: "sut-foydalari" })
  @IsOptionalNotNull()
  @IsString()
  @Matches(SLUG_PATTERN, { message: "slug must be kebab-case (a-z, 0-9, -)" })
  @MaxLength(160)
  slug?: string;

  @ApiPropertyOptional({ format: "uuid", nullable: true })
  @IsOptional()
  @IsUUID()
  categoryId?: string | null;

  @ApiPropertyOptional({ format: "uuid", nullable: true })
  @IsOptional()
  @IsUUID()
  coverImageId?: string | null;

  @ApiPropertyOptional({
    type: [BlogPostTranslationDto],
    description: "Upserted per locale; locales not listed are left unchanged",
  })
  @IsOptionalNotNull()
  @IsArray()
  @ArrayMaxSize(SUPPORTED_LOCALES.length)
  @ValidateNested({ each: true })
  @Type(() => BlogPostTranslationDto)
  translations?: BlogPostTranslationDto[];
}

export class AdminBlogPostQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: BlogStatus })
  @IsOptional()
  @IsEnum(BlogStatus)
  status?: BlogStatus;

  @ApiPropertyOptional({ format: "uuid" })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}

export class BlogCategoryTranslationDto {
  @ApiProperty({ enum: SUPPORTED_LOCALES, example: "ru" })
  @IsIn(SUPPORTED_LOCALES)
  locale!: SupportedLocale;

  @ApiProperty({ maxLength: 120 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @ApiPropertyOptional({ maxLength: 500, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string | null;
}

export class CreateBlogCategoryDto {
  @ApiProperty({ example: "sogliq" })
  @IsString()
  @Matches(SLUG_PATTERN, { message: "slug must be kebab-case (a-z, 0-9, -)" })
  @MaxLength(120)
  slug!: string;

  @ApiProperty({ description: "Default (uz) name", maxLength: 120 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @ApiPropertyOptional({ maxLength: 500, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string | null;

  @ApiPropertyOptional({ type: [BlogCategoryTranslationDto] })
  @IsOptionalNotNull()
  @IsArray()
  @ArrayMaxSize(SUPPORTED_LOCALES.length)
  @ValidateNested({ each: true })
  @Type(() => BlogCategoryTranslationDto)
  translations?: BlogCategoryTranslationDto[];
}

export class UpdateBlogCategoryDto {
  @ApiPropertyOptional()
  @IsOptionalNotNull()
  @IsString()
  @Matches(SLUG_PATTERN, { message: "slug must be kebab-case (a-z, 0-9, -)" })
  @MaxLength(120)
  slug?: string;

  @ApiPropertyOptional({ maxLength: 120 })
  @IsOptionalNotNull()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name?: string;

  @ApiPropertyOptional({ maxLength: 500, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string | null;

  @ApiPropertyOptional({
    type: [BlogCategoryTranslationDto],
    description: "Upserted per locale; locales not listed are left unchanged",
  })
  @IsOptionalNotNull()
  @IsArray()
  @ArrayMaxSize(SUPPORTED_LOCALES.length)
  @ValidateNested({ each: true })
  @Type(() => BlogCategoryTranslationDto)
  translations?: BlogCategoryTranslationDto[];
}
