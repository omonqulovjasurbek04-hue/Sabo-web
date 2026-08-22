import { Injectable } from '@nestjs/common';
import { BlogStatus, ProductStatus } from '@prisma/client';
import { RedisService } from '../common/redis/redis.service';
import { pickTranslation } from '../common/utils/localization.util';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HomeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getHomeData(locale = 'uz') {
    const cacheKey = `home:${locale}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }

    const [hero, featuredCategories, featuredProducts, production, about, certificates, recentBlog] =
      await Promise.all([
        // 1. Hero
        this.prisma.homeHero.findFirst({
          where: { isActive: true },
          include: { backgroundImage: true, productImage: true },
          orderBy: { sortOrder: 'asc' },
        }),

        // 2. Featured Categories
        this.prisma.category.findMany({
          where: { isActive: true, parentId: null },
          include: { translations: true, image: true },
          take: 6,
          orderBy: { sortOrder: 'asc' },
        }),

        // 3. Featured Products
        this.prisma.product.findMany({
          where: { isActive: true, status: ProductStatus.ACTIVE, isFeatured: true, deletedAt: null },
          take: 8,
          include: {
            translations: true,
            category: { include: { translations: true } },
            images: { include: { media: true }, orderBy: { sortOrder: 'asc' } },
            variants: { where: { isAvailable: true } },
            availability: true,
          },
          orderBy: { sortOrder: 'asc' },
        }),

        // 4. Production preview
        this.prisma.productionPage.findFirst({
          where: { status: 'PUBLISHED' },
          include: {
            translations: true,
            heroImage: true,
            steps: { include: { image: true }, take: 4, orderBy: { sortOrder: 'asc' } },
          },
        }),

        // 5. About preview
        this.prisma.aboutPage.findFirst({
          where: { status: 'PUBLISHED' },
          include: {
            translations: true,
            heroImage: true,
            values: { take: 3, orderBy: { sortOrder: 'asc' } },
          },
        }),

        // 6. Certificates preview
        this.prisma.certificate.findMany({
          where: { isActive: true },
          include: { previewMedia: true, documentMedia: true },
          take: 4,
          orderBy: { sortOrder: 'asc' },
        }),

        // 7. Recent Blog posts
        this.prisma.blogPost.findMany({
          where: { status: BlogStatus.PUBLISHED, deletedAt: null },
          include: {
            translations: true,
            coverImage: true,
            category: { include: { translations: true } },
          },
          take: 3,
          orderBy: { publishedAt: 'desc' },
        }),
      ]);

    const result = {
      hero: hero
        ? {
            id: hero.id,
            title: hero.title,
            subtitle: hero.subtitle,
            description: hero.description,
            primaryButton: hero.primaryButton,
            secondaryButton: hero.secondaryButton,
            backgroundImageUrl: hero.backgroundImage?.url || null,
            productImageUrl: hero.productImage?.url || null,
          }
        : null,

      featuredCategories: featuredCategories.map((cat) => {
        const trans = pickTranslation(cat.translations, locale);
        return {
          id: cat.id,
          slug: cat.slug,
          name: trans?.name || cat.name,
          imageUrl: cat.image?.url || null,
        };
      }),

      featuredProducts: featuredProducts.map((p) => {
        const trans = pickTranslation(p.translations, locale);
        const catTrans = p.category ? pickTranslation(p.category.translations, locale) : null;
        return {
          id: p.id,
          slug: p.slug,
          name: trans?.name || p.name,
          shortDescription: trans?.shortDescription || p.shortDescription,
          categoryName: catTrans?.name || p.category?.name || null,
          images: p.images.map((img) => ({
            id: img.id,
            url: img.media?.url || null,
            isPrimary: img.isPrimary,
          })),
          variants: p.variants.map((v) => ({
            id: v.id,
            name: v.name,
            volume: v.volume,
            priceMinor: v.priceMinor,
            currency: v.currency,
          })),
        };
      }),

      productionPreview: production
        ? {
            title: pickTranslation(production.translations, locale)?.title || production.heroTitle,
            description: pickTranslation(production.translations, locale)?.description || production.heroDescription,
            heroImageUrl: production.heroImage?.url || null,
            steps: production.steps.map((s) => ({
              id: s.id,
              title: s.title,
              imageUrl: s.image?.url || null,
            })),
          }
        : null,

      aboutPreview: about
        ? {
            title: pickTranslation(about.translations, locale)?.title || about.heroTitle,
            description: pickTranslation(about.translations, locale)?.description || about.heroDescription,
            values: about.values.map((v) => ({
              id: v.id,
              title: v.title,
              description: v.description,
              icon: v.icon,
            })),
          }
        : null,

      certificates: certificates.map((c) => ({
        id: c.id,
        title: c.title,
        issuedBy: c.issuedBy,
        previewUrl: c.previewMedia?.url || null,
        documentUrl: c.documentMedia?.url || null,
      })),

      recentBlog: recentBlog.map((b) => {
        const trans = pickTranslation(b.translations, locale);
        return {
          id: b.id,
          slug: b.slug,
          title: trans?.title || 'SABO Blog',
          excerpt: trans?.excerpt || null,
          coverImageUrl: b.coverImage?.url || null,
          publishedAt: b.publishedAt,
        };
      }),
    };

    await this.redis.set(cacheKey, JSON.stringify(result), 300); // 5 min cache
    return result;
  }
}
