import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ContactMessageStatus, OrderStatus, RoleType } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.MANAGER)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get real DB metrics and counts for Admin Dashboard' })
  @ApiResponse({ status: 200, description: 'Dashboard metrics returned' })
  async getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('orders')
  @ApiOperation({ summary: 'Get all orders with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus })
  async getOrders(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: OrderStatus,
  ) {
    return this.adminService.getOrders({ page, limit, status });
  }

  @Patch('orders/:id/status')
  @ApiOperation({ summary: 'Update order status' })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.adminService.updateOrderStatus(id, status);
  }

  @Get('messages')
  @ApiOperation({ summary: 'Get all contact messages with filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: ContactMessageStatus })
  async getMessages(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: ContactMessageStatus,
  ) {
    return this.adminService.getMessages({ page, limit, status });
  }

  @Patch('messages/:id/status')
  @ApiOperation({ summary: 'Update contact message status' })
  async updateMessageStatus(
    @Param('id') id: string,
    @Body('status') status: ContactMessageStatus,
  ) {
    return this.adminService.updateMessageStatus(id, status);
  }

  @Get('system')
  @ApiOperation({ summary: 'Get backend system health and environment info' })
  async getSystemInfo() {
    return this.adminService.getSystemInfo();
  }
}
