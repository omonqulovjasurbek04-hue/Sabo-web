import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ProductImageType, ProductStatus } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";

export class ProductTranslationDto {
  @ApiProperty({ example: "uz" })
  @IsNotEmpty()
  @IsString()
  locale!: string;

  @ApiProperty({ example: "Kefir 1L" })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ingredientsText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  storageText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seoDescription?: string;
}

export class ProductImageDto {
  @ApiProperty()
  @IsUUID()
  mediaId!: string;

  @ApiPropertyOptional({
    enum: ProductImageType,
    default: ProductImageType.GALLERY,
  })
  @IsOptional()
  @IsEnum(ProductImageType)
  type?: ProductImageType;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class ProductVariantDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({ example: "1 L" })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: "1" })
  @IsOptional()
  @IsString()
  volume?: string;

  @ApiPropertyOptional({ example: "L" })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiPropertyOptional({
    example: 1200000,
    description: "Price in minor units (e.g. 12000 UZS)",
  })
  @IsOptional()
  @IsInt()
  priceMinor?: number;

  @ApiPropertyOptional({ default: "UZS" })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  stock?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class ProductNutritionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  servingSize?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  calories?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  protein?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  fat?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  carbohydrates?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  sugar?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  salt?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  fiber?: number;
}

export class ProductStorageDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  temperatureMin?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  temperatureMax?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shelfLife?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  storageText?: string;
}

export class CreateProductDto {
  @ApiProperty({ example: "sabo-kefir-1l" })
  @IsNotEmpty()
  @IsString()
  slug!: string;

  @ApiProperty({ example: "SABO Kefir 1L" })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ default: "SABO" })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ enum: ProductStatus, default: ProductStatus.DRAFT })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ type: [ProductTranslationDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductTranslationDto)
  translations?: ProductTranslationDto[];

  @ApiPropertyOptional({ type: [ProductImageDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images?: ProductImageDto[];

  @ApiPropertyOptional({ type: [ProductVariantDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants?: ProductVariantDto[];

  @ApiPropertyOptional({ type: ProductNutritionDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ProductNutritionDto)
  nutrition?: ProductNutritionDto;

  @ApiPropertyOptional({ type: ProductStorageDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ProductStorageDto)
  storage?: ProductStorageDto;
}

export class UpdateProductDto extends CreateProductDto {}
