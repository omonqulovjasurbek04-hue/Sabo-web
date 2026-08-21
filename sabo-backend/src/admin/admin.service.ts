import { Injectable } from '@nestjs/common';
import { BlogStatus, ContactMessageStatus, OrderStatus, ProductStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      ordersCount,
      pendingOrdersCount,
      productsCount,
      activeProductsCount,
      usersCount,
      newMessagesCount,
      publishedBlogCount,
      recentOrders,
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      this.prisma.product.count({ where: { deletedAt: null } }),
      this.prisma.product.count({ where: { status: ProductStatus.ACTIVE, deletedAt: null } }),
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.contactMessage.count({ where: { status: ContactMessageStatus.NEW } }),
      this.prisma.blogPost.count({ where: { status: BlogStatus.PUBLISHED, deletedAt: null } }),
      this.prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          customerName: true,
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
      productsCount,
      activeProductsCount,
      usersCount,
      newMessagesCount,
      publishedBlogCount,
      recentOrders,
    };
  }
}
