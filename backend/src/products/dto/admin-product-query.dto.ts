import { ApiPropertyOptional } from "@nestjs/swagger";
import { ProductStatus } from "@prisma/client";
import { IsEnum, IsOptional } from "class-validator";
import { PaginationQueryDto } from "../../common/dto/pagination.dto";

export class AdminProductQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: ProductStatus,
    description: "Filter by product status (omit for all non-deleted)",
  })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;
}
