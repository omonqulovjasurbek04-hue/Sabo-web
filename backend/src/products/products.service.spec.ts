import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ProductStatus, RoleType } from "@prisma/client";
import { ROLES_KEY } from "../common/decorators/roles.decorator";
import { RedisService } from "../common/redis/redis.service";
import { PrismaService } from "../prisma/prisma.service";
import { AdminProductQueryDto } from "./dto/admin-product-query.dto";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";

describe("ProductsService (admin)", () => {
  let service: ProductsService;

  const productRow = {
    id: "prod-1",
    slug: "sabo-kefir-1l",
    name: "SABO Kefir",
    description: null,
    shortDescription: null,
    brand: "SABO",
    status: ProductStatus.DRAFT,
    isActive: true,
    isFeatured: false,
    sortOrder: 0,
    categoryId: null,
    publishedAt: null,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
    deletedAt: null,
    translations: [{ locale: "uz", name: "Kefir" }],
    category: null,
    images: [
      {
        id: "img-1",
        mediaId: "media-1",
        media: { url: "https://cdn/kefir.webp" },
        type: "PRIMARY",
        sortOrder: 0,
        altText: null,
        isPrimary: true,
      },
    ],
    variants: [
      {
        id: "var-1",
        name: "1 L",
        volume: "1",
        unit: "L",
        sku: "KEFIR-1L",
        barcode: null,
        priceMinor: 1400000,
        currency: "UZS",
        stock: 5,
        isAvailable: false,
        isDefault: true,
      },
    ],
    nutrition: null,
    storage: null,
    availability: null,
  };

  const mockPrisma = {
    product: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    productTranslation: { deleteMany: jest.fn() },
    productImage: { deleteMany: jest.fn() },
    productVariant: {
      findMany: jest.fn(),
      deleteMany: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockRedis = {
    get: jest.fn(),
    set: jest.fn(),
    delPattern: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockPrisma.$transaction.mockImplementation(
      (cb: (tx: typeof mockPrisma) => Promise<unknown>) => cb(mockPrisma),
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  const adminQuery = (overrides: Partial<AdminProductQueryDto> = {}) =>
    Object.assign(new AdminProductQueryDto(), overrides);

  describe("findAllAdmin", () => {
    it("lists all non-deleted products regardless of status or availability", async () => {
      mockPrisma.product.findMany.mockResolvedValue([productRow]);
      mockPrisma.product.count.mockResolvedValue(1);

      const result = await service.findAllAdmin(adminQuery());

      const args = mockPrisma.product.findMany.mock.calls[0][0];
      expect(args.where).toEqual({ deletedAt: null });
      expect(args.include.variants.where).toBeUndefined();
      expect(result.meta.total).toBe(1);
      expect(result.data[0]).toMatchObject({
        id: "prod-1",
        status: ProductStatus.DRAFT,
        isActive: true,
        translations: [{ locale: "uz", name: "Kefir" }],
        images: [{ mediaId: "media-1", url: "https://cdn/kefir.webp" }],
        variants: [{ id: "var-1", stock: 5, isAvailable: false }],
      });
    });

    it("applies status filter and pagination", async () => {
      mockPrisma.product.findMany.mockResolvedValue([]);
      mockPrisma.product.count.mockResolvedValue(30);

      const result = await service.findAllAdmin(
        adminQuery({ status: ProductStatus.ARCHIVED, page: 2, limit: 10 }),
      );

      const args = mockPrisma.product.findMany.mock.calls[0][0];
      expect(args.where).toEqual({
        deletedAt: null,
        status: ProductStatus.ARCHIVED,
      });
      expect(args.skip).toBe(10);
      expect(args.take).toBe(10);
      expect(result.meta).toMatchObject({ page: 2, totalPages: 3 });
    });
  });

  describe("update", () => {
    beforeEach(() => {
      mockPrisma.product.findUnique.mockResolvedValue(productRow);
      mockPrisma.product.update.mockResolvedValue(productRow);
    });

    it("applies a partial update without touching nested collections", async () => {
      await service.update("prod-1", { isFeatured: true });

      const data = mockPrisma.product.update.mock.calls[0][0].data;
      expect(data.isFeatured).toBe(true);
      expect(data.slug).toBeUndefined();
      expect(data.images).toBeUndefined();
      expect(data.nutrition).toBeUndefined();
      expect(mockPrisma.productVariant.deleteMany).not.toHaveBeenCalled();
      expect(mockPrisma.productImage.deleteMany).not.toHaveBeenCalled();
      expect(mockRedis.delPattern).toHaveBeenCalledWith("product:*");
      expect(mockRedis.delPattern).toHaveBeenCalledWith("products:*");
    });

    it("upserts variants by id and deletes removed ones", async () => {
      mockPrisma.productVariant.findMany.mockResolvedValue([
        { id: "var-1" },
        { id: "var-2" },
      ]);

      await service.update("prod-1", {
        variants: [
          { id: "var-1", name: "1 L", priceMinor: 1500000, stock: 3 },
          { name: "0.5 L", priceMinor: 800000 },
        ],
      });

      expect(mockPrisma.productVariant.deleteMany).toHaveBeenCalledWith({
        where: { productId: "prod-1", id: { notIn: ["var-1"] } },
      });
      expect(mockPrisma.productVariant.update).toHaveBeenCalledWith({
        where: { id: "var-1" },
        data: expect.objectContaining({ priceMinor: 1500000, stock: 3 }),
      });
      expect(mockPrisma.productVariant.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          productId: "prod-1",
          name: "0.5 L",
          priceMinor: 800000,
        }),
      });
    });

    it("rejects variant ids that belong to another product", async () => {
      mockPrisma.productVariant.findMany.mockResolvedValue([{ id: "var-1" }]);

      await expect(
        service.update("prod-1", {
          variants: [{ id: "other-var", name: "1 L" }],
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(mockPrisma.productVariant.deleteMany).not.toHaveBeenCalled();
      expect(mockRedis.delPattern).not.toHaveBeenCalled();
    });

    it("replaces images and upserts nutrition and storage", async () => {
      await service.update("prod-1", {
        images: [{ mediaId: "media-2", isPrimary: true }],
        nutrition: { calories: 0, protein: 3.2 },
        storage: { temperatureMin: 2, temperatureMax: 6 },
      });

      expect(mockPrisma.productImage.deleteMany).toHaveBeenCalledWith({
        where: { productId: "prod-1" },
      });
      const data = mockPrisma.product.update.mock.calls[0][0].data;
      expect(data.images.createMany.data).toEqual([
        expect.objectContaining({ mediaId: "media-2", isPrimary: true }),
      ]);
      expect(data.nutrition.upsert.update).toMatchObject({
        calories: 0,
        protein: 3.2,
        fat: null,
      });
      expect(data.storage.upsert.create).toMatchObject({
        temperatureMin: 2,
        temperatureMax: 6,
      });
    });

    it("throws for missing or soft-deleted products", async () => {
      mockPrisma.product.findUnique.mockResolvedValue({
        ...productRow,
        deletedAt: new Date(),
      });

      await expect(
        service.update("prod-1", { name: "x" }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});

describe("ProductsController admin list", () => {
  it("is restricted to catalog staff roles", () => {
    const roles: RoleType[] = Reflect.getMetadata(
      ROLES_KEY,
      ProductsController.prototype.getAdminProducts,
    );
    expect(roles).toEqual([
      RoleType.SUPER_ADMIN,
      RoleType.ADMIN,
      RoleType.EDITOR,
      RoleType.MANAGER,
    ]);
  });
});
