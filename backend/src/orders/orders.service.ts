import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  OrderStatus,
  PaymentProviderType,
  PaymentStatus,
  Prisma,
  RoleType,
} from "@prisma/client";
import * as crypto from "crypto";
import { PaginatedResult } from "../common/dto/pagination.dto";
import { ErrorCode } from "../common/enums/error-code.enum";
import { PrismaService } from "../prisma/prisma.service";
import {
  CreateOrderDto,
  OrderQueryDto,
  UpdateOrderStatusDto,
} from "./dto/create-order.dto";
import { OrderPricingService } from "./services/order-pricing.service";

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pricingService: OrderPricingService,
  ) {}

  private generateOrderNumber(): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomHex = crypto.randomBytes(3).toString("hex").toUpperCase();
    return `SABO-${dateStr}-${randomHex}`;
  }

  async createOrder(
    dto: CreateOrderDto,
    userId?: string,
    idempotencyKey?: string,
  ) {
    // 1. Check idempotency if key provided
    if (idempotencyKey) {
      const existing = await this.prisma.order.findUnique({
        where: { idempotencyKey },
        include: { items: true, address: true, payments: true },
      });
      if (existing) {
        return existing;
      }
    }

    // 2. Determine items to order
    let itemsToProcess: { productVariantId: string; quantity: number }[] = [];

    if (dto.items && dto.items.length > 0) {
      itemsToProcess = dto.items;
    } else if (dto.cartId) {
      const cart = await this.prisma.cart.findUnique({
        where: { id: dto.cartId },
        include: { items: true },
      });
      if (!cart || cart.items.length === 0) {
        throw new BadRequestException({
          code: ErrorCode.CART_NOT_FOUND,
          message: "Cart is empty or not found",
        });
      }
      itemsToProcess = cart.items.map((i) => ({
        productVariantId: i.productVariantId,
        quantity: i.quantity,
      }));
    } else {
      throw new BadRequestException({
        code: ErrorCode.VALIDATION_ERROR,
        message: "Must provide either items or a valid cartId",
      });
    }

    // 3. Calculate real prices server-side
    const pricing = await this.pricingService.calculatePricing(itemsToProcess);

    const orderNumber = this.generateOrderNumber();
    const provider = dto.paymentProvider || PaymentProviderType.CASH;

    // 4. Atomic Prisma Transaction
    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: userId || null,
          status: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          currency: pricing.currency,
          subtotalMinor: pricing.subtotalMinor,
          discountMinor: pricing.discountMinor,
          deliveryMinor: pricing.deliveryMinor,
          taxMinor: pricing.taxMinor,
          totalMinor: pricing.totalMinor,
          customerName: dto.customerName,
          customerPhone: dto.customerPhone,
          customerEmail: dto.customerEmail || null,
          note: dto.note || null,
          idempotencyKey: idempotencyKey || null,
          items: {
            createMany: {
              data: pricing.items.map((item) => ({
                productId: item.productId,
                variantId: item.variantId,
                productName: item.productName,
                variantName: item.variantName,
                sku: item.sku,
                quantity: item.quantity,
                unitPriceMinor: item.unitPriceMinor,
                subtotalMinor: item.subtotalMinor,
                currency: item.currency,
              })),
            },
          },
          address: dto.address
            ? {
                create: {
                  recipientName: dto.address.recipientName,
                  phone: dto.address.phone,
                  city: dto.address.city || null,
                  district: dto.address.district || null,
                  street: dto.address.street || null,
                  apartment: dto.address.apartment || null,
                  deliveryNote: dto.address.deliveryNote || null,
                },
              }
            : undefined,
          payments: {
            create: {
              provider,
              status: PaymentStatus.PENDING,
              amountMinor: pricing.totalMinor,
              currency: pricing.currency,
            },
          },
        },
        include: {
          items: true,
          address: true,
          payments: true,
        },
      });

      // Clear cart if ordered from cart
      if (dto.cartId) {
        await tx.cartItem.deleteMany({ where: { cartId: dto.cartId } });
      }

      return newOrder;
    });

    return order;
  }

  async getOrderById(orderId: string, user: { id: string; roles: string[] }) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        address: true,
        payments: true,
      },
    });

    if (!order) {
      throw new NotFoundException({
        code: ErrorCode.ORDER_NOT_FOUND,
        message: "Order not found",
      });
    }

    // Ownership check: Customer can only see their own order
    const isAdmin =
      user.roles.includes(RoleType.SUPER_ADMIN) ||
      user.roles.includes(RoleType.ADMIN) ||
      user.roles.includes(RoleType.MANAGER);

    if (!isAdmin && order.userId !== user.id) {
      throw new ForbiddenException({
        code: ErrorCode.AUTH_FORBIDDEN,
        message: "You do not have permission to view this order",
      });
    }

    return order;
  }

  async getUserOrders(userId: string, query: OrderQueryDto) {
    const { page, limit } = query;
    const skip = query.skip;

    const where: Prisma.OrderWhereInput = { userId };
    if (query.status) where.status = query.status;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { items: true, payments: true },
      }),
      this.prisma.order.count({ where }),
    ]);

    return new PaginatedResult(orders, total, page, limit);
  }

  async cancelOrder(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order)
      throw new NotFoundException({ code: ErrorCode.ORDER_NOT_FOUND });

    if (order.userId !== userId) {
      throw new ForbiddenException({ code: ErrorCode.AUTH_FORBIDDEN });
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException({
        code: ErrorCode.ORDER_CANNOT_CANCEL,
        message: `Cannot cancel order in status ${order.status}`,
      });
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.CANCELLED,
        cancelledAt: new Date(),
      },
    });
  }

  // Admin Endpoints
  async findAllAdmin(query: OrderQueryDto) {
    const { page, limit } = query;
    const skip = query.skip;

    const where: Prisma.OrderWhereInput = {};
    if (query.status) where.status = query.status;
    if (query.paymentStatus) where.paymentStatus = query.paymentStatus;
    if (query.search) {
      where.OR = [
        { orderNumber: { contains: query.search, mode: "insensitive" } },
        { customerName: { contains: query.search, mode: "insensitive" } },
        { customerPhone: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
          address: true,
          payments: true,
          user: { select: { email: true, phone: true } },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return new PaginatedResult(orders, total, page, limit);
  }

  async updateStatusAdmin(
    orderId: string,
    dto: UpdateOrderStatusDto,
    adminId: string,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order)
      throw new NotFoundException({ code: ErrorCode.ORDER_NOT_FOUND });

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: dto.status,
        completedAt:
          dto.status === OrderStatus.DELIVERED ? new Date() : undefined,
        cancelledAt:
          dto.status === OrderStatus.CANCELLED ? new Date() : undefined,
        notes: dto.note
          ? {
              create: {
                content: dto.note,
                authorId: adminId,
              },
            }
          : undefined,
      },
      include: { items: true, notes: true },
    });

    return updated;
  }
}
