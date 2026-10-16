import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { BlogStatus, Prisma } from "@prisma/client";
import {
  assertCompleteLocales,
  assertUniqueLocales,
  ensureMediaExists,
} from "../common/cms/cms.util";
import { ContentChangeService } from "../common/cms/content-change.service";
import { PaginatedResult } from "../common/dto/pagination.dto";
import { ErrorCode } from "../common/enums/error-code.enum";
import { PrismaService } from "../prisma/prisma.service";
import {
  AdminBlogPostQueryDto,
  BlogPostTranslationDto,
  CreateBlogCategoryDto,
  CreateBlogPostDto,
  UpdateBlogCategoryDto,
  UpdateBlogPostDto,
} from "./dto/blog-admin.dto";

const POST_INCLUDE = {
  translations: { orderBy: { locale: "asc" } },
  coverImage: true,
  category: { include: { translations: true } },
  author: { select: { id: true, firstName: true, lastName: true } },
} satisfies Prisma.BlogPostInclude;

const CATEGORY_INCLUDE = {
  translations: { orderBy: { locale: "asc" } },
  _count: { select: { posts: true } },
} satisfies Prisma.BlogCategoryInclude;

const STATUS_ACTIONS: Record<BlogStatus, string> = {
  [BlogStatus.PUBLISHED]: "blog_post.publish",
  [BlogStatus.DRAFT]: "blog_post.unpublish",
  [BlogStatus.ARCHIVED]: "blog_post.archive",
};

@Injectable()
export class BlogAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly changes: ContentChangeService,
  ) {}

  // ==========================================
  // POSTS
  // ==========================================

  async listPosts(query: AdminBlogPostQueryDto) {
    const { page, limit, search, status, categoryId } = query;

    const where: Prisma.BlogPostWhereInput = { deletedAt: null };
    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;
    if (search) {
      where.OR = [
        { slug: { contains: search, mode: "insensitive" } },
        {
          translations: {
            some: { title: { contains: search, mode: "insensitive" } },
          },
        },
      ];
    }

    const [posts, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        skip: query.skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
        include: POST_INCLUDE,
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return new PaginatedResult(posts, total, page, limit);
  }

  async getPost(id: string) {
    const post = await this.prisma.blogPost.findFirst({
      where: { id, deletedAt: null },
      include: POST_INCLUDE,
    });
    if (!post) {
      throw new NotFoundException({
        code: ErrorCode.BLOG_POST_NOT_FOUND,
        message: "Blog post not found",
      });
    }
    return post;
  }

  async createPost(dto: CreateBlogPostDto, userId: string) {
    assertUniqueLocales(dto.translations);
    await this.assertPostSlugFree(dto.slug);
    await this.assertCategoryExists(dto.categoryId);
    await ensureMediaExists(this.prisma, [dto.coverImageId]);

    const post = await this.prisma.blogPost.create({
      data: {
        slug: dto.slug,
        status: BlogStatus.DRAFT,
        categoryId: dto.categoryId ?? null,
        coverImageId: dto.coverImageId ?? null,
        authorId: userId,
        translations: {
          createMany: {
            data: dto.translations.map((t) => this.toTranslationData(t)),
          },
        },
      },
      include: POST_INCLUDE,
    });

    await this.changes.record({
      userId,
      action: "blog_post.create",
      entity: "BlogPost",
      entityId: post.id,
      after: post,
    });
    return post;
  }

  async updatePost(id: string, dto: UpdateBlogPostDto, userId: string) {
    const before = await this.getPost(id);
    assertUniqueLocales(dto.translations);
    if (dto.slug && dto.slug !== before.slug) {
      await this.assertPostSlugFree(dto.slug);
    }
    await this.assertCategoryExists(dto.categoryId);
    await ensureMediaExists(this.prisma, [dto.coverImageId]);

    const after = await this.prisma.$transaction(async (tx) => {
      for (const t of dto.translations ?? []) {
        const data = this.toTranslationData(t);
        await tx.blogPostTranslation.upsert({
          where: { postId_locale: { postId: id, locale: t.locale } },
          create: { ...data, postId: id },
          update: data,
        });
      }
      return tx.blogPost.update({
        where: { id },
        data: {
          slug: dto.slug,
          categoryId: dto.categoryId,
          coverImageId: dto.coverImageId,
        },
        include: POST_INCLUDE,
      });
    });

    await this.changes.record({
      userId,
      action: "blog_post.update",
      entity: "BlogPost",
      entityId: id,
      before,
      after,
    });
    return after;
  }

  /** Publish / unpublish (DRAFT) / archive. Posts are never hard-deleted. */
  async setPostStatus(id: string, status: BlogStatus, userId: string) {
    const before = await this.getPost(id);
    if (status === BlogStatus.PUBLISHED) {
      assertCompleteLocales(before.translations);
    }

    const after = await this.prisma.blogPost.update({
      where: { id },
      data: {
        status,
        // Keep the original publication date when re-publishing.
        publishedAt:
          status === BlogStatus.PUBLISHED
            ? (before.publishedAt ?? new Date())
            : before.publishedAt,
      },
      include: POST_INCLUDE,
    });

    await this.changes.record({
      userId,
      action: STATUS_ACTIONS[status],
      entity: "BlogPost",
      entityId: id,
      before: { status: before.status, publishedAt: before.publishedAt },
      after: { status: after.status, publishedAt: after.publishedAt },
    });
    return after;
  }

  // ==========================================
  // CATEGORIES
  // ==========================================

  async listCategories() {
    return this.prisma.blogCategory.findMany({
      include: CATEGORY_INCLUDE,
      orderBy: { name: "asc" },
    });
  }

  async createCategory(dto: CreateBlogCategoryDto, userId: string) {
    assertUniqueLocales(dto.translations);
    await this.assertCategorySlugFree(dto.slug);

    const category = await this.prisma.blogCategory.create({
      data: {
        slug: dto.slug,
        name: dto.name,
        description: dto.description ?? null,
        translations: dto.translations
          ? {
              createMany: {
                data: dto.translations.map((t) => ({
                  locale: t.locale,
                  name: t.name,
                  description: t.description ?? null,
                })),
              },
            }
          : undefined,
      },
      include: CATEGORY_INCLUDE,
    });

    await this.changes.record({
      userId,
      action: "blog_category.create",
      entity: "BlogCategory",
      entityId: category.id,
      after: category,
    });
    return category;
  }

  async updateCategory(id: string, dto: UpdateBlogCategoryDto, userId: string) {
    const before = await this.getCategory(id);
    assertUniqueLocales(dto.translations);
    if (dto.slug && dto.slug !== before.slug) {
      await this.assertCategorySlugFree(dto.slug);
    }

    const after = await this.prisma.$transaction(async (tx) => {
      for (const t of dto.translations ?? []) {
        const data = {
          name: t.name,
          description: t.description ?? null,
        };
        await tx.blogCategoryTranslation.upsert({
          where: { categoryId_locale: { categoryId: id, locale: t.locale } },
          create: { ...data, locale: t.locale, categoryId: id },
          update: data,
        });
      }
      return tx.blogCategory.update({
        where: { id },
        data: {
          slug: dto.slug,
          name: dto.name,
          description: dto.description,
        },
        include: CATEGORY_INCLUDE,
      });
    });

    await this.changes.record({
      userId,
      action: "blog_category.update",
      entity: "BlogCategory",
      entityId: id,
      before,
      after,
    });
    return after;
  }

  /**
   * Categories have no status column, so removal is a real delete — allowed only
   * when no post (in any status) still references the category.
   */
  async deleteCategory(id: string, userId: string) {
    const before = await this.getCategory(id);
    if (before._count.posts > 0) {
      throw new ConflictException({
        code: ErrorCode.BLOG_CATEGORY_IN_USE,
        message: `Category is used by ${before._count.posts} post(s); reassign them first`,
      });
    }

    await this.prisma.blogCategory.delete({ where: { id } });
    await this.changes.record({
      userId,
      action: "blog_category.delete",
      entity: "BlogCategory",
      entityId: id,
      before,
    });
    return { success: true };
  }

  // ==========================================
  // HELPERS
  // ==========================================

  private async getCategory(id: string) {
    const category = await this.prisma.blogCategory.findUnique({
      where: { id },
      include: CATEGORY_INCLUDE,
    });
    if (!category) {
      throw new NotFoundException({
        code: ErrorCode.BLOG_CATEGORY_NOT_FOUND,
        message: "Blog category not found",
      });
    }
    return category;
  }

  private toTranslationData(t: BlogPostTranslationDto) {
    return {
      locale: t.locale,
      title: t.title,
      excerpt: t.excerpt ?? null,
      content: t.content,
      seoTitle: t.seoTitle ?? null,
      seoDescription: t.seoDescription ?? null,
    };
  }

  private async assertPostSlugFree(slug: string) {
    const existing = await this.prisma.blogPost.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException({
        code: ErrorCode.BLOG_SLUG_EXISTS,
        message: "A blog post with this slug already exists",
      });
    }
  }

  private async assertCategorySlugFree(slug: string) {
    const existing = await this.prisma.blogCategory.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException({
        code: ErrorCode.BLOG_CATEGORY_SLUG_EXISTS,
        message: "A blog category with this slug already exists",
      });
    }
  }

  private async assertCategoryExists(categoryId: string | null | undefined) {
    if (!categoryId) return;
    const category = await this.prisma.blogCategory.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });
    if (!category) {
      throw new NotFoundException({
        code: ErrorCode.BLOG_CATEGORY_NOT_FOUND,
        message: "Blog category not found",
      });
    }
  }
}
