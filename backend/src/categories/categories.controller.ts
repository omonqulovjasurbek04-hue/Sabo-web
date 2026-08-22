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
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleType } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard, Public } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/create-category.dto';

@ApiTags('Categories')
@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // ==========================================
  // PUBLIC ENDPOINTS
  // ==========================================

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Get all public product categories with translation fallback' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of categories' })
  async getCategories(@Query('locale') locale = 'uz') {
    return this.categoriesService.findAllPublic(locale);
  }

  @Public()
  @Get('categories/:slug')
  @ApiOperation({ summary: 'Get category detail by slug with products' })
  async getCategoryBySlug(
    @Param('slug') slug: string,
    @Query('locale') locale = 'uz',
  ) {
    return this.categoriesService.findBySlug(slug, locale);
  }

  // ==========================================
  // ADMIN ENDPOINTS
  // ==========================================

  @Post('admin/categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new category (Admin)' })
  async create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Patch('admin/categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a category (Admin)' })
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @Delete('admin/categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a category (Admin)' })
  async delete(@Param('id') id: string) {
    return this.categoriesService.delete(id);
  }
}
