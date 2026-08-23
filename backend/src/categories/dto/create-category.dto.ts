import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";

export class CategoryTranslationDto {
  @ApiProperty({ example: "uz" })
  @IsNotEmpty()
  @IsString()
  locale!: string;

  @ApiProperty({ example: "Kefir" })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: "Tabiiy va foydali kefir mahsulotlari" })
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateCategoryDto {
  @ApiProperty({ example: "kefir" })
  @IsNotEmpty()
  @IsString()
  slug!: string;

  @ApiProperty({ example: "Kefir" })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: "Tabiiy kefir mahsulotlari" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  imageId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ type: [CategoryTranslationDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryTranslationDto)
  translations?: CategoryTranslationDto[];
}

export class UpdateCategoryDto extends CreateCategoryDto {}
