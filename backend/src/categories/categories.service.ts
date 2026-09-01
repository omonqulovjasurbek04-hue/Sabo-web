import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ErrorCode } from "../common/enums/error-code.enum";
import { RedisService } from "../common/redis/redis.service";
import { pickTranslation } from "../common/utils/localization.util";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCategoryDto } from "./dto/create-category.dto";

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async findAllPublic(locale = "uz") {
    const cacheKey = `categories:public:${locale}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }

    const categories = await this.prisma.category.findMany({
      where: { isActive: true },
      include: {
        translations: true,
        image: {
          select: { id: true, url: true, altText: true },
        },
        children: {
          where: { isActive: true },
          include: {
            translations: true,
            image: { select: { id: true, url: true, altText: true } },
          },
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { sortOrder: "asc" },
    });

    const formatted = categories
      .filter((cat) => !cat.parentId) // Top-level
      .map((cat) => this.formatCategory(cat, locale));

    await this.redis.set(cacheKey, JSON.stringify(formatted), 300); // 5 min cache
    return formatted;
  }

  async findBySlug(slug: string, locale = "uz") {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        translations: true,
        image: { select: { id: true, url: true, altText: true } },
        children: {
          where: { isActive: true },
          include: { translations: true, image: true },
        },
        products: {
          where: { isActive: true, status: "ACTIVE" },
          include: {
            translations: true,
            images: { include: { media: true }, orderBy: { sortOrder: "asc" } },
            variants: { where: { isAvailable: true } },
          },
        },
      },
    });

    if (!category || !category.isActive) {
      throw new NotFoundException({
        code: ErrorCode.CATEGORY_NOT_FOUND,
        message: "Category not found",
      });
    }

    return this.formatCategory(category, locale);
  }

  async create(dto: CreateCategoryDto) {
    const existing = await this.prisma.category.findUnique({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ConflictException({
        code: ErrorCode.CATEGORY_SLUG_EXISTS,
        message: "A category with this slug already exists",
      });
    }

    const category = await this.prisma.category.create({
      data: {
        slug: dto.slug,
        name: dto.name,
        description: dto.description || null,
        imageId: dto.imageId || null,
        parentId: dto.parentId || null,
        sortOrder: dto.sortOrder || 0,
        isActive: dto.isActive !== undefined ? dto.isActive : true,
        translations: dto.translations
          ? {
              createMany: {
                data: dto.translations.map((t) => ({
                  locale: t.locale,
                  name: t.name,
                  description: t.description || null,
                })),
              },
            }
          : undefined,
      },
      include: { translations: true, image: true },
    });

    await this.invalidateCache();
    return category;
  }

  async update(id: string, dto: Partial<CreateCategoryDto>) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException({ code: ErrorCode.CATEGORY_NOT_FOUND });
    }

    if (dto.slug && dto.slug !== category.slug) {
      const existing = await this.prisma.category.findUnique({
        where: { slug: dto.slug },
      });
      if (existing) {
        throw new ConflictException({ code: ErrorCode.CATEGORY_SLUG_EXISTS });
      }
    }

    if (dto.translations) {
      await this.prisma.categoryTranslation.deleteMany({
        where: { categoryId: id },
      });
    }

    const updated = await this.prisma.category.update({
      where: { id },
      data: {
        slug: dto.slug,
        name: dto.name,
        description: dto.description,
        imageId: dto.imageId,
        parentId: dto.parentId,
        sortOrder: dto.sortOrder,
        isActive: dto.isActive,
        translations: dto.translations
          ? {
              createMany: {
                data: dto.translations.map((t) => ({
                  locale: t.locale,
                  name: t.name,
                  description: t.description || null,
                })),
              },
            }
          : undefined,
      },
      include: { translations: true, image: true },
    });

    await this.invalidateCache();
    return updated;
  }

  async delete(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category)
      throw new NotFoundException({ code: ErrorCode.CATEGORY_NOT_FOUND });

    await this.prisma.category.delete({ where: { id } });
    await this.invalidateCache();
    return { success: true, message: "Category deleted" };
  }

  private formatCategory(category: any, locale: string) {
    const translation = pickTranslation(category.translations, locale);
    return {
      id: category.id,
      slug: category.slug,
      name: translation?.name || category.name,
      description: translation?.description || category.description,
      image: category.image
        ? { id: category.image.id, url: category.image.url }
        : null,
      children: category.children?.map((child: any) =>
        this.formatCategory(child, locale),
      ),
      products: category.products?.map((product: any) => {
        const productTranslation = pickTranslation(product.translations, locale);
        const primaryImage = product.images?.find((image: any) => image.isPrimary) || product.images?.[0];
        return {
          id: product.id,
          slug: product.slug,
          name: productTranslation?.name || product.name,
          description: productTranslation?.description || product.description || null,
          imageUrl: primaryImage?.media?.url || null,
        };
      }) || [],
      sortOrder: category.sortOrder,
      isActive: category.isActive,
    };
  }

  private async invalidateCache() {
    await this.redis.delPattern("categories:*");
  }
}
