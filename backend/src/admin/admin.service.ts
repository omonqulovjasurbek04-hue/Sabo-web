import { Injectable, NotFoundException } from '@nestjs/common';
import {
  BlogStatus,
  ContactMessageStatus,
  OrderStatus,
  ProductStatus,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Real database metrics and analytics for Admin Dashboard
   */
  async getDashboardStats() {
    const [
      ordersCount,
      pendingOrdersCount,
      confirmedOrdersCount,
      completedOrdersCount,
      productsCount,
      activeProductsCount,
      usersCount,
      newMessagesCount,
      publishedBlogCount,
      recentOrders,
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      this.prisma.order.count({ where: { status: OrderStatus.CONFIRMED } }),
      this.prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
      this.prisma.product.count({ where: { deletedAt: null } }),
      this.prisma.product.count({ where: { status: ProductStatus.ACTIVE, deletedAt: null } }),
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.contactMessage.count({ where: { status: ContactMessageStatus.NEW } }),
      this.prisma.blogPost.count({ where: { status: BlogStatus.PUBLISHED, deletedAt: null } }),
      this.prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          customerName: true,
          customerPhone: true,
          totalMinor: true,
          currency: true,
          status: true,
          paymentStatus: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      ordersCount,
      pendingOrdersCount,
      confirmedOrdersCount,
      completedOrdersCount,
      productsCount,
      activeProductsCount,
      usersCount,
      newMessagesCount,
      publishedBlogCount,
      recentOrders,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get all orders with pagination and filtering
   */
  async getOrders(query: { page?: number; limit?: number; status?: OrderStatus }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(50, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) {
      where.status = query.status;
    }

    const [total, orders] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          address: true,
          payments: true,
        },
      }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Buyurtma topilmadi: ${orderId}`);
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  /**
   * Get contact messages with filtering
   */
  async getMessages(query: { page?: number; limit?: number; status?: ContactMessageStatus }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(50, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) {
      where.status = query.status;
    }

    const [total, messages] = await Promise.all([
      this.prisma.contactMessage.count({ where }),
      this.prisma.contactMessage.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: messages,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update contact message status
   */
  async updateMessageStatus(messageId: string, status: ContactMessageStatus) {
    const message = await this.prisma.contactMessage.findUnique({ where: { id: messageId } });
    if (!message) {
      throw new NotFoundException(`Xabar topilmadi: ${messageId}`);
    }

    return this.prisma.contactMessage.update({
      where: { id: messageId },
      data: { status },
    });
  }

  /**
   * Backend system & health info
   */
  async getSystemInfo() {
    return {
      platform: 'SABO Dairy Backend Platform',
      version: '1.0.0',
      nodeVersion: process.version,
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
      database: 'PostgreSQL (Prisma ORM)',
      cache: 'Redis Active',
      serverTime: new Date().toISOString(),
    };
  }
}
