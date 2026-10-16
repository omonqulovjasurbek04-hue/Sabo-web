import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from "class-validator";
import { IsOptionalNotNull } from "../../common/cms/cms.util";

export class CreateProductionStepDto {
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
}

export class UpdateProductionStepDto {
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
}
