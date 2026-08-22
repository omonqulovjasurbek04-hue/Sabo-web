import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderPricingService } from './order-pricing.service';

describe('OrderPricingService (Tamper-Proof Financial Tests)', () => {
  let service: OrderPricingService;
  let prisma: PrismaService;

  const mockPrisma = {
    productVariant: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderPricingService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<OrderPricingService>(OrderPricingService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should calculate order totals accurately using real DB variant prices in minor units', async () => {
    const mockVariants = [
      {
        id: 'var-1',
        productId: 'prod-1',
        name: '1 L',
        sku: 'KEFIR-1L',
        priceMinor: 1400000, // 14,000 UZS
        currency: 'UZS',
        isAvailable: true,
        product: { id: 'prod-1', name: 'SABO Kefir 1L', isActive: true, status: ProductStatus.ACTIVE },
      },
      {
        id: 'var-2',
        productId: 'prod-2',
        name: '0.5 L',
        sku: 'MILK-05L',
        priceMinor: 800000, // 8,000 UZS
        currency: 'UZS',
        isAvailable: true,
        product: { id: 'prod-2', name: 'SABO Milk 0.5L', isActive: true, status: ProductStatus.ACTIVE },
      },
    ];

    mockPrisma.productVariant.findMany.mockResolvedValue(mockVariants);

    const result = await service.calculatePricing(
      [
        { productVariantId: 'var-1', quantity: 2 }, // 2 * 14,000 = 28,000
        { productVariantId: 'var-2', quantity: 3 }, // 3 * 8,000 = 24,000
      ],
      1000000, // delivery fee = 10,000
      'UZS',
    );

    expect(result.subtotalMinor).toBe(5200000); // 52,000 UZS
    expect(result.deliveryMinor).toBe(1000000); // 10,000 UZS
    expect(result.totalMinor).toBe(6200000); // 62,000 UZS
    expect(result.items.length).toBe(2);
    expect(result.items[0].subtotalMinor).toBe(2800000);
    expect(result.items[1].subtotalMinor).toBe(2400000);
  });

  it('should throw BadRequestException if variant is inactive or unavailable', async () => {
    mockPrisma.productVariant.findMany.mockResolvedValue([
      {
        id: 'var-inactive',
        productId: 'prod-1',
        isAvailable: false,
        product: { isActive: true, status: ProductStatus.ACTIVE },
      },
    ]);

    await expect(
      service.calculatePricing([{ productVariantId: 'var-inactive', quantity: 1 }]),
    ).rejects.toThrow(BadRequestException);
  });
});
