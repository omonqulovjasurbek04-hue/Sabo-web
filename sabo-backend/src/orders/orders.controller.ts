import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleType } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard, Public } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateOrderDto, OrderQueryDto, UpdateOrderStatusDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ==========================================
  // CUSTOMER / PUBLIC CHECKOUT ENDPOINTS
  // ==========================================

  @Public()
  @Post('orders')
  @ApiOperation({ summary: 'Create a new order (Checkout - Guest or Authenticated)' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Order created with price snapshot' })
  async createOrder(
    @Body() dto: CreateOrderDto,
    @Headers('idempotency-key') idempotencyKey?: string,
    @CurrentUser('id') userId?: string,
  ) {
    return this.ordersService.createOrder(dto, userId, idempotencyKey);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('orders')
  @ApiOperation({ summary: 'Get current user order history' })
  async getMyOrders(
    @CurrentUser('id') userId: string,
    @Query() query: OrderQueryDto,
  ) {
    return this.ordersService.getUserOrders(userId, query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('orders/:id')
  @ApiOperation({ summary: 'Get order details by ID (Owner only)' })
  async getOrder(
    @Param('id') orderId: string,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.getOrderById(orderId, user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('orders/:id/cancel')
  @ApiOperation({ summary: 'Cancel pending order (Owner only)' })
  async cancelOrder(
    @Param('id') orderId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.ordersService.cancelOrder(orderId, userId);
  }

  // ==========================================
  // ADMIN ORDER MANAGEMENT
  // ==========================================

  @Get('admin/orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all orders (Admin)' })
  async findAllAdmin(@Query() query: OrderQueryDto) {
    return this.ordersService.findAllAdmin(query);
  }

  @Patch('admin/orders/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update order status with optional internal note (Admin)' })
  async updateStatusAdmin(
    @Param('id') orderId: string,
    @Body() dto: UpdateOrderStatusDto,
    @CurrentUser('id') adminId: string,
  ) {
    return this.ordersService.updateStatusAdmin(orderId, dto, adminId);
  }
}
