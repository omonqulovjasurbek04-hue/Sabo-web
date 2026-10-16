import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
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

export class CreateAboutTimelineDto {
  @ApiProperty({ example: "2018", maxLength: 20 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  year!: string;

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

export class UpdateAboutTimelineDto {
  @ApiPropertyOptional({ maxLength: 20 })
  @IsOptionalNotNull()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  year?: string;

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

export class CreateAboutValueDto {
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

  @ApiPropertyOptional({
    maxLength: 100,
    nullable: true,
    description: "Icon key, e.g. a lucide icon name",
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  icon?: string | null;

  @ApiPropertyOptional({ default: 0 })
  @IsOptionalNotNull()
  @IsInt()
  @Min(0)
  @Max(10_000)
  sortOrder?: number;
}

export class UpdateAboutValueDto {
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

  @ApiPropertyOptional({ maxLength: 100, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  icon?: string | null;

  @ApiPropertyOptional()
  @IsOptionalNotNull()
  @IsInt()
  @Min(0)
  @Max(10_000)
  sortOrder?: number;
}

export class CreateTeamMemberDto {
  @ApiProperty({ maxLength: 120 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @ApiProperty({ maxLength: 120 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  position!: string;

  @ApiPropertyOptional({ format: "uuid", nullable: true })
  @IsOptional()
  @IsUUID()
  photoMediaId?: string | null;

  @ApiPropertyOptional({ maxLength: 2000, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string | null;

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

export class UpdateTeamMemberDto {
  @ApiPropertyOptional({ maxLength: 120 })
  @IsOptionalNotNull()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name?: string;

  @ApiPropertyOptional({ maxLength: 120 })
  @IsOptionalNotNull()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  position?: string;

  @ApiPropertyOptional({ format: "uuid", nullable: true })
  @IsOptional()
  @IsUUID()
  photoMediaId?: string | null;

  @ApiPropertyOptional({ maxLength: 2000, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string | null;

  @ApiPropertyOptional()
  @IsOptionalNotNull()
  @IsInt()
  @Min(0)
  @Max(10_000)
  sortOrder?: number;
}
