import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from "class-validator";

export class AddCartItemDto {
  @ApiProperty({ description: "Product Variant UUID" })
  @IsNotEmpty()
  @IsUUID()
  productVariantId!: string;

  @ApiProperty({ example: 1, minimum: 1, maximum: 50 })
  @IsInt()
  @Min(1)
  @Max(50)
  quantity!: number;

  @ApiPropertyOptional({ description: "Guest session identifier" })
  @IsOptional()
  @IsString()
  sessionId?: string;
}

export class UpdateCartItemDto {
  @ApiProperty({ example: 2, minimum: 1, maximum: 50 })
  @IsInt()
  @Min(1)
  @Max(50)
  quantity!: number;
}
