import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma, ProductStatus } from "@prisma/client";
import { PaginatedResult } from "../common/dto/pagination.dto";
import { ErrorCode } from "../common/enums/error-code.enum";
import { RedisService } from "../common/redis/redis.service";
import { pickTranslation } from "../common/utils/localization.util";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductQueryDto } from "./dto/product-query.dto";

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async findAllPublic(query: ProductQueryDto) {
    const {
      page,
      limit,
      search,
      category,
      featured,
      locale = "uz",
      sort,
      order,
    } = query;
    const skip = query.skip;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      status: ProductStatus.ACTIVE,
      deletedAt: null,
    };

    if (featured !== undefined) {
      where.isFeatured = featured;
    }

    if (category) {
      where.category = {
        OR: [{ slug: category }, { id: category }],
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        {
          translations: {
            some: {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            },
          },
        },
      ];
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    if (sort === "name") {
      orderBy.name = order;
    } else if (sort === "sortOrder") {
      orderBy.sortOrder = order;
    } else {
      orderBy.createdAt = order;
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          translations: true,
          category: {
            include: { translations: true },
          },
          images: {
            include: { media: true },
            orderBy: { sortOrder: "asc" },
          },
          variants: {
            where: { isAvailable: true },
            orderBy: { createdAt: "asc" },
          },
          availability: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const formatted = products.map((p) => this.formatPublicProduct(p, locale));
    return new PaginatedResult(formatted, total, page, limit);
  }

  async findFeatured(locale = "uz") {
    const cacheKey = `products:featured:${locale}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }

    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        status: ProductStatus.ACTIVE,
        isFeatured: true,
        deletedAt: null,
      },
      take: 8,
      orderBy: { sortOrder: "asc" },
      include: {
        translations: true,
        category: { include: { translations: true } },
        images: { include: { media: true }, orderBy: { sortOrder: "asc" } },
        variants: { where: { isAvailable: true } },
        availability: true,
      },
    });

    const formatted = products.map((p) => this.formatPublicProduct(p, locale));
    await this.redis.set(cacheKey, JSON.stringify(formatted), 300);
    return formatted;
  }

  async findBySlug(slug: string, locale = "uz") {
    const cacheKey = `product:${slug}:${locale}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }

    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        translations: true,
        category: {
          include: { translations: true },
        },
        images: {
          include: { media: true },
          orderBy: { sortOrder: "asc" },
        },
        variants: {
          where: { isAvailable: true },
          orderBy: { createdAt: "asc" },
        },
        nutrition: true,
        ingredients: {
          orderBy: { order: "asc" },
        },
        storage: true,
        availability: true,
        seo: true,
        threeDAsset: {
          include: { media: true },
        },
      },
    });

    if (
      !product ||
      !product.isActive ||
      product.status !== ProductStatus.ACTIVE ||
      product.deletedAt
    ) {
      throw new NotFoundException({
        code: ErrorCode.PRODUCT_NOT_FOUND,
        message: "Product not found",
      });
    }

    const formatted = this.formatPublicProductDetail(product, locale);
    await this.redis.set(cacheKey, JSON.stringify(formatted), 300);
    return formatted;
  }

  async create(dto: CreateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ConflictException({
        code: ErrorCode.PRODUCT_SLUG_EXISTS,
        message: "A product with this slug already exists",
      });
    }

    const product = await this.prisma.product.create({
      data: {
        slug: dto.slug,
        name: dto.name,
        description: dto.description || null,
        shortDescription: dto.shortDescription || null,
        categoryId: dto.categoryId || null,
        brand: dto.brand || "SABO",
        status: dto.status || ProductStatus.DRAFT,
        isFeatured: dto.isFeatured || false,
        isActive: dto.isActive !== undefined ? dto.isActive : true,
        translations: dto.translations
          ? {
              createMany: {
                data: dto.translations.map((t) => ({
                  locale: t.locale,
                  name: t.name,
                  description: t.description || null,
                  shortDescription: t.shortDescription || null,
                  ingredientsText: t.ingredientsText || null,
                  storageText: t.storageText || null,
                  seoTitle: t.seoTitle || null,
                  seoDescription: t.seoDescription || null,
                })),
              },
            }
          : undefined,
        images: dto.images
          ? {
              createMany: {
                data: dto.images.map((img) => ({
                  mediaId: img.mediaId,
                  type: img.type,
                  sortOrder: img.sortOrder || 0,
                  altText: img.altText || null,
                  isPrimary: img.isPrimary || false,
                })),
              },
            }
          : undefined,
        variants: dto.variants
          ? {
              createMany: {
                data: dto.variants.map((v) => ({
                  name: v.name,
                  volume: v.volume || null,
                  unit: v.unit || null,
                  sku: v.sku || null,
                  barcode: v.barcode || null,
                  priceMinor: v.priceMinor || null,
                  currency: v.currency || "UZS",
                  stock: v.stock || 0,
                  isAvailable:
                    v.isAvailable !== undefined ? v.isAvailable : true,
                  isDefault: v.isDefault || false,
                })),
              },
            }
          : undefined,
        nutrition: dto.nutrition
          ? {
              create: {
                servingSize: dto.nutrition.servingSize || null,
                calories: dto.nutrition.calories || null,
                protein: dto.nutrition.protein || null,
                fat: dto.nutrition.fat || null,
                carbohydrates: dto.nutrition.carbohydrates || null,
                sugar: dto.nutrition.sugar || null,
                salt: dto.nutrition.salt || null,
                fiber: dto.nutrition.fiber || null,
              },
            }
          : undefined,
        storage: dto.storage
          ? {
              create: {
                temperatureMin: dto.storage.temperatureMin || null,
                temperatureMax: dto.storage.temperatureMax || null,
                shelfLife: dto.storage.shelfLife || null,
                storageText: dto.storage.storageText || null,
              },
            }
          : undefined,
      },
      include: {
        translations: true,
        images: { include: { media: true } },
        variants: true,
        nutrition: true,
        storage: true,
      },
    });

    await this.invalidateCache();
    return product;
  }

  async update(id: string, dto: Partial<CreateProductDto>) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product)
      throw new NotFoundException({ code: ErrorCode.PRODUCT_NOT_FOUND });

    if (dto.slug && dto.slug !== product.slug) {
      const existing = await this.prisma.product.findUnique({
        where: { slug: dto.slug },
      });
      if (existing)
        throw new ConflictException({ code: ErrorCode.PRODUCT_SLUG_EXISTS });
    }

    if (dto.translations) {
      await this.prisma.productTranslation.deleteMany({
        where: { productId: id },
      });
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        slug: dto.slug,
        name: dto.name,
        description: dto.description,
        shortDescription: dto.shortDescription,
        categoryId: dto.categoryId,
        brand: dto.brand,
        status: dto.status,
        isFeatured: dto.isFeatured,
        isActive: dto.isActive,
        translations: dto.translations
          ? {
              createMany: {
                data: dto.translations.map((t) => ({
                  locale: t.locale,
                  name: t.name,
                  description: t.description || null,
                  shortDescription: t.shortDescription || null,
                  ingredientsText: t.ingredientsText || null,
                  storageText: t.storageText || null,
                  seoTitle: t.seoTitle || null,
                  seoDescription: t.seoDescription || null,
                })),
              },
            }
          : undefined,
      },
      include: { translations: true, images: true, variants: true },
    });

    await this.invalidateCache();
    return updated;
  }

  async setStatus(id: string, status: ProductStatus) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product)
      throw new NotFoundException({ code: ErrorCode.PRODUCT_NOT_FOUND });

    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        status,
        publishedAt:
          status === ProductStatus.ACTIVE ? new Date() : product.publishedAt,
      },
    });

    await this.invalidateCache();
    return updated;
  }

  async softDelete(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product)
      throw new NotFoundException({ code: ErrorCode.PRODUCT_NOT_FOUND });

    await this.prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
        status: ProductStatus.ARCHIVED,
      },
    });

    await this.invalidateCache();
    return { success: true, message: "Product archived" };
  }

  // Formatters
  private formatPublicProduct(p: any, locale: string) {
    const trans = pickTranslation(p.translations, locale);
    const catTrans = p.category
      ? pickTranslation(p.category.translations, locale)
      : null;

    return {
      id: p.id,
      slug: p.slug,
      name: trans?.name || p.name,
      shortDescription: trans?.shortDescription || p.shortDescription || null,
      description: trans?.description || p.description || null,
      brand: p.brand,
      isFeatured: p.isFeatured,
      category: p.category
        ? {
            id: p.category.id,
            slug: p.category.slug,
            name: catTrans?.name || p.category.name,
          }
        : null,
      images: p.images.map((img: any) => ({
        id: img.id,
        url: img.media?.url || null,
        type: img.type,
        altText: img.altText || img.media?.altText || null,
        isPrimary: img.isPrimary,
      })),
      variants: p.variants.map((v: any) => ({
        id: v.id,
        name: v.name,
        volume: v.volume,
        unit: v.unit,
        priceMinor: v.priceMinor,
        currency: v.currency,
        isAvailable: v.isAvailable,
        isDefault: v.isDefault,
      })),
      availability: p.availability
        ? {
            status: p.availability.status,
            stock: p.availability.stock,
          }
        : null,
    };
  }

  private formatPublicProductDetail(p: any, locale: string) {
    const base = this.formatPublicProduct(p, locale);
    const trans = pickTranslation(p.translations, locale);
    const seo = p.seo ? pickTranslation(p.seo, locale) : null;

    return {
      ...base,
      ingredients:
        p.ingredients && p.ingredients.length > 0
          ? p.ingredients.map((ing: any) => ({
              id: ing.id,
              name: ing.name,
              isAllergen: ing.isAllergen,
              allergenNote: ing.allergenNote,
            }))
          : [],
      nutrition: p.nutrition
        ? {
            servingSize: p.nutrition.servingSize,
            calories: p.nutrition.calories,
            protein: p.nutrition.protein,
            fat: p.nutrition.fat,
            carbohydrates: p.nutrition.carbohydrates,
            sugar: p.nutrition.sugar,
            salt: p.nutrition.salt,
            fiber: p.nutrition.fiber,
          }
        : null,
      storage: p.storage
        ? {
            temperatureMin: p.storage.temperatureMin,
            temperatureMax: p.storage.temperatureMax,
            shelfLife: p.storage.shelfLife,
            storageText: trans?.storageText || p.storage.storageText || null,
          }
        : null,
      threeDAsset: p.threeDAsset?.isActive
        ? {
            id: p.threeDAsset.id,
            url: p.threeDAsset.media?.url || null,
            metadata: p.threeDAsset.metadata,
          }
        : null,
      seo: seo
        ? {
            title: seo.title || trans?.seoTitle || null,
            description: seo.description || trans?.seoDescription || null,
            canonicalUrl: seo.canonicalUrl,
          }
        : {},
    };
  }

  private async invalidateCache() {
    await this.redis.delPattern("product:*");
    await this.redis.delPattern("products:*");
  }
}
