import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsDateString,
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

export class CreateCertificateDto {
  @ApiProperty({ example: "ISO 22000:2018", maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({ maxLength: 2000, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string | null;

  @ApiPropertyOptional({
    format: "uuid",
    nullable: true,
    description: "Scanned certificate (PDF/image). Required before activation.",
  })
  @IsOptional()
  @IsUUID()
  documentMediaId?: string | null;

  @ApiPropertyOptional({ format: "uuid", nullable: true })
  @IsOptional()
  @IsUUID()
  previewMediaId?: string | null;

  @ApiPropertyOptional({ maxLength: 200, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  issuedBy?: string | null;

  @ApiPropertyOptional({ maxLength: 100, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  certificateNumber?: string | null;

  @ApiPropertyOptional({ format: "date-time", nullable: true })
  @IsOptional()
  @IsDateString()
  issuedAt?: string | null;

  @ApiPropertyOptional({ format: "date-time", nullable: true })
  @IsOptional()
  @IsDateString()
  expiresAt?: string | null;

  @ApiPropertyOptional({ default: 0 })
  @IsOptionalNotNull()
  @IsInt()
  @Min(0)
  @Max(10_000)
  sortOrder?: number;
}

export class UpdateCertificateDto {
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
  documentMediaId?: string | null;

  @ApiPropertyOptional({ format: "uuid", nullable: true })
  @IsOptional()
  @IsUUID()
  previewMediaId?: string | null;

  @ApiPropertyOptional({ maxLength: 200, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  issuedBy?: string | null;

  @ApiPropertyOptional({ maxLength: 100, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  certificateNumber?: string | null;

  @ApiPropertyOptional({ format: "date-time", nullable: true })
  @IsOptional()
  @IsDateString()
  issuedAt?: string | null;

  @ApiPropertyOptional({ format: "date-time", nullable: true })
  @IsOptional()
  @IsDateString()
  expiresAt?: string | null;

  @ApiPropertyOptional()
  @IsOptionalNotNull()
  @IsInt()
  @Min(0)
  @Max(10_000)
  sortOrder?: number;
}

export class AdminCertificateQueryDto {
  @ApiPropertyOptional({ description: "Filter by active flag" })
  @IsOptional()
  @Transform(({ value }) => value === "true" || value === true)
  @IsBoolean()
  isActive?: boolean;
}
