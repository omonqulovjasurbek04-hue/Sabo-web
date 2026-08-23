import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ProductStatus, RoleType } from "@prisma/client";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard, Public } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { CreateProductDto, UpdateProductDto } from "./dto/create-product.dto";
import { ProductQueryDto } from "./dto/product-query.dto";
import { ProductsService } from "./products.service";

@ApiTags("Products")
@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ==========================================
  // PUBLIC ENDPOINTS
  // ==========================================

  @Public()
  @Get("products")
  @ApiOperation({
    summary:
      "Get paginated public products catalog with filters and translations",
  })
  @ApiResponse({ status: HttpStatus.OK, description: "Paginated product list" })
  async getProducts(@Query() query: ProductQueryDto) {
    return this.productsService.findAllPublic(query);
  }

  @Public()
  @Get("products/featured")
  @ApiOperation({ summary: "Get featured products for homepage / widgets" })
  async getFeatured(@Query("locale") locale = "uz") {
    return this.productsService.findFeatured(locale);
  }

  @Public()
  @Get("products/:slug")
  @ApiOperation({ summary: "Get detailed product information by slug" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Product detail with ingredients, nutrition and storage",
  })
  async getProductBySlug(
    @Param("slug") slug: string,
    @Query("locale") locale = "uz",
  ) {
    return this.productsService.findBySlug(slug, locale);
  }

  // ==========================================
  // ADMIN ENDPOINTS
  // ==========================================

  @Post("admin/products")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new product (Admin)" })
  async create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Patch("admin/products/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update an existing product (Admin)" })
  async update(@Param("id") id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Post("admin/products/:id/publish")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Publish product to catalog" })
  async publish(@Param("id") id: string) {
    return this.productsService.setStatus(id, ProductStatus.ACTIVE);
  }

  @Post("admin/products/:id/archive")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Archive product" })
  async archive(@Param("id") id: string) {
    return this.productsService.setStatus(id, ProductStatus.ARCHIVED);
  }

  @Delete("admin/products/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Soft-delete / Archive product" })
  async delete(@Param("id") id: string) {
    return this.productsService.softDelete(id);
  }
}
