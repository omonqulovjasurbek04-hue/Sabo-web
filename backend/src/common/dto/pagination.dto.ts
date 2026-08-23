import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";
import { APP_CONSTANTS } from "../../config/constants";

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export class PaginationQueryDto {
  @ApiPropertyOptional({ default: 1, minimum: 1, description: "Page number" })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = APP_CONSTANTS.PAGINATION.DEFAULT_PAGE;

  @ApiPropertyOptional({
    default: 12,
    minimum: 1,
    maximum: 100,
    description: "Items per page",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(APP_CONSTANTS.PAGINATION.MAX_LIMIT)
  limit: number = APP_CONSTANTS.PAGINATION.DEFAULT_LIMIT;

  @ApiPropertyOptional({ description: "Search keyword" })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    default: "createdAt",
    description: "Field to sort by",
  })
  @IsOptional()
  @IsString()
  sort: string = "createdAt";

  @ApiPropertyOptional({
    enum: SortOrder,
    default: SortOrder.DESC,
    description: "Sort direction",
  })
  @IsOptional()
  @IsEnum(SortOrder)
  order: SortOrder = SortOrder.DESC;

  @ApiPropertyOptional({
    enum: ["uz", "ru", "en"],
    default: "uz",
    description: "Content locale",
  })
  @IsOptional()
  @IsIn(["uz", "ru", "en"])
  locale: string = "uz";

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export class PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;

  constructor(data: T[], total: number, page: number, limit: number) {
    const totalPages = Math.ceil(total / limit) || 1;
    this.data = data;
    this.meta = {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }
}
