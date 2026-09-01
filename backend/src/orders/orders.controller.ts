import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { JwtAuthGuard, Public } from "../common/guards/jwt-auth.guard";
import { OptionalJwtAuthGuard } from "../common/guards/optional-jwt-auth.guard";
import { CreateOrderDto, OrderQueryDto } from "./dto/create-order.dto";
import { OrdersService } from "./orders.service";

@ApiTags("Orders")
@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ==========================================
  // CUSTOMER / PUBLIC CHECKOUT ENDPOINTS
  // ==========================================

  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @Post("orders")
  @ApiOperation({
    summary: "Create a new order (Checkout - Guest or Authenticated)",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Order created with price snapshot",
  })
  async createOrder(
    @Body() dto: CreateOrderDto,
    @Headers("idempotency-key") idempotencyKey?: string,
    @Headers("x-session-id") sessionId?: string,
    @CurrentUser("id") userId?: string,
  ) {
    return this.ordersService.createOrder(dto, userId, sessionId, idempotencyKey);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get("orders")
  @ApiOperation({ summary: "Get current user order history" })
  async getMyOrders(
    @CurrentUser("id") userId: string,
    @Query() query: OrderQueryDto,
  ) {
    return this.ordersService.getUserOrders(userId, query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get("orders/:id")
  @ApiOperation({ summary: "Get order details by ID (Owner only)" })
  async getOrder(@Param("id") orderId: string, @CurrentUser() user: any) {
    return this.ordersService.getOrderById(orderId, user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post("orders/:id/cancel")
  @ApiOperation({ summary: "Cancel pending order (Owner only)" })
  async cancelOrder(
    @Param("id") orderId: string,
    @CurrentUser("id") userId: string,
  ) {
    return this.ordersService.cancelOrder(orderId, userId);
  }
}
