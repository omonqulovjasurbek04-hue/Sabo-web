import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductStatus } from '@prisma/client';
import { ErrorCode } from '../../common/enums/error-code.enum';
import { PrismaService } from '../../prisma/prisma.service';

export interface CalculatedPricingItem {
  variantId: string;
  productId: string;
  productName: string;
  variantName: string;
  sku: string | null;
  unitPriceMinor: number;
  quantity: number;
  subtotalMinor: number;
  currency: string;
}

export interface CalculatedOrderPricing {
  items: CalculatedPricingItem[];
  subtotalMinor: number;
  discountMinor: number;
  deliveryMinor: number;
  taxMinor: number;
  totalMinor: number;
  currency: string;
}

@Injectable()
export class OrderPricingService {
  constructor(private readonly prisma: PrismaService) {}

  async calculatePricing(
    requestedItems: { productVariantId: string; quantity: number }[],
    deliveryMinor = 0,
    currency = 'UZS',
  ): Promise<CalculatedOrderPricing> {
    if (!requestedItems || requestedItems.length === 0) {
      throw new BadRequestException({
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Order must contain at least one item',
      });
    }

    const variantIds = requestedItems.map((i) => i.productVariantId);
    const variants = await this.prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: true },
    });

    const calculatedItems: CalculatedPricingItem[] = [];
    let subtotalMinor = 0;

    for (const reqItem of requestedItems) {
      const variant = variants.find((v) => v.id === reqItem.productVariantId);

      if (
        !variant ||
        !variant.isAvailable ||
        !variant.product ||
        !variant.product.isActive ||
        variant.product.status !== ProductStatus.ACTIVE ||
        variant.product.deletedAt
      ) {
        throw new BadRequestException({
          code: ErrorCode.PRODUCT_INACTIVE,
          message: `Product variant ${reqItem.productVariantId} is unavailable`,
        });
      }

      if (reqItem.quantity <= 0 || reqItem.quantity > 100) {
        throw new BadRequestException({
          code: ErrorCode.INVALID_QUANTITY,
          message: 'Invalid item quantity',
        });
      }

      const unitPriceMinor = variant.priceMinor || 0;
      const itemSubtotalMinor = unitPriceMinor * reqItem.quantity;
      subtotalMinor += itemSubtotalMinor;

      calculatedItems.push({
        variantId: variant.id,
        productId: variant.productId,
        productName: variant.product.name,
        variantName: variant.name,
        sku: variant.sku,
        unitPriceMinor,
        quantity: reqItem.quantity,
        subtotalMinor: itemSubtotalMinor,
        currency: variant.currency || currency,
      });
    }

    const discountMinor = 0;
    const taxMinor = 0;
    const totalMinor = subtotalMinor + deliveryMinor + taxMinor - discountMinor;

    return {
      items: calculatedItems,
      subtotalMinor,
      discountMinor,
      deliveryMinor,
      taxMinor,
      totalMinor,
      currency,
    };
  }
}
