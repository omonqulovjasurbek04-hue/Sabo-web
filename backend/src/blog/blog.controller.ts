import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PaginationQueryDto } from "../common/dto/pagination.dto";
import { Public } from "../common/guards/jwt-auth.guard";
import { BlogService } from "./blog.service";

@ApiTags("Blog")
@Controller("blog")
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: "Get published blog posts with pagination and category filter",
  })
  @ApiResponse({ status: 200, description: "Paginated blog posts" })
  async getPosts(
    @Query() query: PaginationQueryDto,
    @Query("category") category?: string,
  ) {
    return this.blogService.findAllPublic(query, category);
  }

  @Public()
  @Get("categories")
  @ApiOperation({ summary: "Get blog categories" })
  async getCategories(@Query("locale") locale = "uz") {
    return this.blogService.getCategories(locale);
  }

  @Public()
  @Get(":slug")
  @ApiOperation({ summary: "Get single blog post detail by slug" })
  async getPostBySlug(
    @Param("slug") slug: string,
    @Query("locale") locale = "uz",
  ) {
    return this.blogService.findBySlug(slug, locale);
  }
}
