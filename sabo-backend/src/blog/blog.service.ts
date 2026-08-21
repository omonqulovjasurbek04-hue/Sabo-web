import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogStatus, Prisma } from '@prisma/client';
import { PaginatedResult, PaginationQueryDto } from '../common/dto/pagination.dto';
import { ErrorCode } from '../common/enums/error-code.enum';
import { pickTranslation } from '../common/utils/localization.util';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPublic(query: PaginationQueryDto, categorySlug?: string) {
    const { page, limit, search, locale = 'uz' } = query;
    const skip = query.skip;

    const where: Prisma.BlogPostWhereInput = {
      status: BlogStatus.PUBLISHED,
      deletedAt: null,
    };

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (search) {
      where.translations = {
        some: {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
          ],
        },
      };
    }

    const [posts, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          translations: true,
          coverImage: true,
          category: { include: { translations: true } },
          author: { select: { firstName: true, lastName: true } },
        },
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    const formatted = posts.map((post) => this.formatPublicPost(post, locale));
    return new PaginatedResult(formatted, total, page, limit);
  }

  async findBySlug(slug: string, locale = 'uz') {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
      include: {
        translations: true,
        coverImage: true,
        category: { include: { translations: true } },
        author: { select: { firstName: true, lastName: true } },
      },
    });

    if (!post || post.status !== BlogStatus.PUBLISHED || post.deletedAt) {
      throw new NotFoundException({
        code: ErrorCode.BLOG_POST_NOT_FOUND,
        message: 'Blog post not found',
      });
    }

    return this.formatPublicPostDetail(post, locale);
  }

  async getCategories(locale = 'uz') {
    const categories = await this.prisma.blogCategory.findMany({
      include: { translations: true },
      orderBy: { name: 'asc' },
    });

    return categories.map((cat) => {
      const trans = pickTranslation(cat.translations, locale);
      return {
        id: cat.id,
        slug: cat.slug,
        name: trans?.name || cat.name,
        description: trans?.description || cat.description,
      };
    });
  }

  private formatPublicPost(post: any, locale: string) {
    const trans = pickTranslation(post.translations, locale);
    const catTrans = post.category ? pickTranslation(post.category.translations, locale) : null;

    return {
      id: post.id,
      slug: post.slug,
      title: trans?.title || 'SABO Blog',
      excerpt: trans?.excerpt || null,
      publishedAt: post.publishedAt,
      coverImageUrl: post.coverImage?.url || null,
      category: post.category
        ? {
            id: post.category.id,
            slug: post.category.slug,
            name: catTrans?.name || post.category.name,
          }
        : null,
      authorName: post.author
        ? `${post.author.firstName || ''} ${post.author.lastName || ''}`.trim()
        : null,
    };
  }

  private formatPublicPostDetail(post: any, locale: string) {
    const base = this.formatPublicPost(post, locale);
    const trans = pickTranslation(post.translations, locale);

    return {
      ...base,
      content: trans?.content || '',
      seo: {
        title: trans?.seoTitle || trans?.title || null,
        description: trans?.seoDescription || trans?.excerpt || null,
      },
    };
  }
}
