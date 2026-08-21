import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { ErrorCode } from '../common/enums/error-code.enum';
import { PrismaService } from '../prisma/prisma.service';
import { AddCartItemDto, UpdateCartItemDto } from './dto/add-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateCart(userId?: string, sessionId?: string) {
    if (userId) {
      let cart = await this.prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: {
                      images: { include: { media: true }, where: { isPrimary: true } },
                    },
                  },
                },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!cart) {
        cart = await this.prisma.cart.create({
          data: { userId },
          include: {
            items: {
              include: {
                variant: {
                  include: {
                    product: {
                      include: {
                        images: { include: { media: true }, where: { isPrimary: true } },
                      },
                    },
                  },
                },
              },
            },
          },
        });
      }
      return cart;
    }

    // Guest Cart
    const effectiveSessionId = sessionId || uuidv4();
    let cart = await this.prisma.cart.findUnique({
      where: { sessionId: effectiveSessionId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: { include: { media: true }, where: { isPrimary: true } },
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { sessionId: effectiveSessionId },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: {
                      images: { include: { media: true }, where: { isPrimary: true } },
                    },
                  },
                },
              },
            },
          },
        },
      });
    }

    return cart;
  }

  async getCart(userId?: string, sessionId?: string) {
    const cart = await this.getOrCreateCart(userId, sessionId);
    return this.formatCart(cart);
  }

  async addItem(dto: AddCartItemDto, userId?: string) {
    // 1. Verify variant & product
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: dto.productVariantId },
      include: { product: true },
    });

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
        message: 'Product variant is unavailable or inactive',
      });
    }

    const cart = await this.getOrCreateCart(userId, dto.sessionId);

    // 2. Check if item already in cart
    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productVariantId: {
          cartId: cart.id,
          productVariantId: variant.id,
        },
      },
    });

    if (existingItem) {
      const newQty = existingItem.quantity + dto.quantity;
      if (newQty > 50) {
        throw new BadRequestException({
          code: ErrorCode.INVALID_QUANTITY,
          message: 'Maximum limit of 50 per item reached',
        });
      }

      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productVariantId: variant.id,
          quantity: dto.quantity,
        },
      });
    }

    return this.getCart(userId, cart.sessionId || undefined);
  }

  async updateItemQuantity(itemId: string, dto: UpdateCartItemDto, userId?: string, sessionId?: string) {
    const cart = await this.getOrCreateCart(userId, sessionId);
    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!item) {
      throw new NotFoundException({
        code: ErrorCode.CART_ITEM_NOT_FOUND,
        message: 'Cart item not found',
      });
    }

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: dto.quantity },
    });

    return this.getCart(userId, sessionId);
  }

  async removeItem(itemId: string, userId?: string, sessionId?: string) {
    const cart = await this.getOrCreateCart(userId, sessionId);
    await this.prisma.cartItem.deleteMany({
      where: { id: itemId, cartId: cart.id },
    });
    return this.getCart(userId, sessionId);
  }

  async clearCart(userId?: string, sessionId?: string) {
    const cart = await this.getOrCreateCart(userId, sessionId);
    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
    return { success: true, message: 'Cart cleared' };
  }

  async mergeGuestCart(userId: string, sessionId: string) {
    const guestCart = await this.prisma.cart.findUnique({
      where: { sessionId },
      include: { items: true },
    });

    if (!guestCart || guestCart.items.length === 0) return;

    const userCart = await this.getOrCreateCart(userId);

    for (const item of guestCart.items) {
      const existing = await this.prisma.cartItem.findUnique({
        where: {
          cartId_productVariantId: {
            cartId: userCart.id,
            productVariantId: item.productVariantId,
          },
        },
      });

      if (existing) {
        await this.prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: Math.min(existing.quantity + item.quantity, 50) },
        });
      } else {
        await this.prisma.cartItem.create({
          data: {
            cartId: userCart.id,
            productVariantId: item.productVariantId,
            quantity: item.quantity,
          },
        });
      }
    }

    // Delete guest cart after merge
    await this.prisma.cart.delete({ where: { id: guestCart.id } });
  }

  private formatCart(cart: any) {
    let subtotalMinor = 0;
    const items = (cart.items || []).map((item: any) => {
      const variant = item.variant;
      const product = variant.product;
      const primaryImg = product?.images?.[0]?.media?.url || null;
      const unitPrice = variant.priceMinor || 0;
      const itemSubtotal = unitPrice * item.quantity;
      subtotalMinor += itemSubtotal;

      return {
        id: item.id,
        variantId: variant.id,
        productId: product?.id || null,
        productName: product?.name || 'Product',
        productSlug: product?.slug || '',
        variantName: variant.name,
        volume: variant.volume,
        unit: variant.unit,
        unitPriceMinor: variant.priceMinor,
        subtotalMinor: itemSubtotal,
        currency: variant.currency || 'UZS',
        quantity: item.quantity,
        imageUrl: primaryImg,
      };
    });

    return {
      id: cart.id,
      sessionId: cart.sessionId,
      currency: cart.currency,
      subtotalMinor,
      itemsCount: items.reduce((acc: number, cur: any) => acc + cur.quantity, 0),
      items,
    };
  }
}
