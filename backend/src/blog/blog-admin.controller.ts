import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { BlogStatus, RoleType } from "@prisma/client";
import { CMS_EDITOR_ROLES } from "../common/cms/cms.util";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { BlogAdminService } from "./blog-admin.service";
import {
  AdminBlogPostQueryDto,
  CreateBlogCategoryDto,
  CreateBlogPostDto,
  UpdateBlogCategoryDto,
  UpdateBlogPostDto,
} from "./dto/blog-admin.dto";

@ApiTags("Admin / Blog")
@ApiBearerAuth()
@Controller("admin/blog")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(...CMS_EDITOR_ROLES)
export class BlogAdminController {
  constructor(private readonly blogAdminService: BlogAdminService) {}

  @Get("posts")
  @ApiOperation({ summary: "List blog posts in every status (Admin)" })
  async listPosts(@Query() query: AdminBlogPostQueryDto) {
    return this.blogAdminService.listPosts(query);
  }

  @Get("posts/:id")
  @ApiOperation({ summary: "Get blog post with all translations (Admin)" })
  async getPost(@Param("id", ParseUUIDPipe) id: string) {
    return this.blogAdminService.getPost(id);
  }

  @Post("posts")
  @ApiOperation({ summary: "Create blog post as DRAFT (Admin)" })
  async createPost(
    @Body() dto: CreateBlogPostDto,
    @CurrentUser("id") userId: string,
  ) {
    return this.blogAdminService.createPost(dto, userId);
  }

  @Patch("posts/:id")
  @ApiOperation({ summary: "Update blog post, upserting translations (Admin)" })
  async updatePost(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateBlogPostDto,
    @CurrentUser("id") userId: string,
  ) {
    return this.blogAdminService.updatePost(id, dto, userId);
  }

  @Post("posts/:id/publish")
  @ApiOperation({
    summary: "Publish blog post (requires uz, ru, en translations)",
  })
  async publishPost(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser("id") userId: string,
  ) {
    return this.blogAdminService.setPostStatus(
      id,
      BlogStatus.PUBLISHED,
      userId,
    );
  }

  @Post("posts/:id/unpublish")
  @ApiOperation({ summary: "Move blog post back to DRAFT" })
  async unpublishPost(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser("id") userId: string,
  ) {
    return this.blogAdminService.setPostStatus(id, BlogStatus.DRAFT, userId);
  }

  @Post("posts/:id/archive")
  @ApiOperation({ summary: "Archive blog post (no hard delete)" })
  async archivePost(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser("id") userId: string,
  ) {
    return this.blogAdminService.setPostStatus(id, BlogStatus.ARCHIVED, userId);
  }

  @Get("categories")
  @ApiOperation({ summary: "List blog categories with post counts (Admin)" })
  async listCategories() {
    return this.blogAdminService.listCategories();
  }

  @Post("categories")
  @ApiOperation({ summary: "Create blog category (Admin)" })
  async createCategory(
    @Body() dto: CreateBlogCategoryDto,
    @CurrentUser("id") userId: string,
  ) {
    return this.blogAdminService.createCategory(dto, userId);
  }

  @Patch("categories/:id")
  @ApiOperation({ summary: "Update blog category (Admin)" })
  async updateCategory(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateBlogCategoryDto,
    @CurrentUser("id") userId: string,
  ) {
    return this.blogAdminService.updateCategory(id, dto, userId);
  }

  @Delete("categories/:id")
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @ApiOperation({
    summary: "Delete unused blog category (409 if posts reference it)",
  })
  async deleteCategory(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser("id") userId: string,
  ) {
    return this.blogAdminService.deleteCategory(id, userId);
  }
}
