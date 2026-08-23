import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Public } from "../common/guards/jwt-auth.guard";
import { OptionalJwtAuthGuard } from "../common/guards/optional-jwt-auth.guard";
import { CartService } from "./cart.service";
import { AddCartItemDto, UpdateCartItemDto } from "./dto/add-cart-item.dto";

@ApiTags("Cart")
@Controller("cart")
@UseGuards(OptionalJwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Get current user or guest cart" })
  @ApiResponse({
    status: 200,
    description: "Cart content with calculated subtotal",
  })
  async getCart(
    @Headers("x-session-id") sessionHeader?: string,
    @Query("sessionId") sessionQuery?: string,
    @CurrentUser("id") userId?: string,
  ) {
    const sessionId = sessionHeader || sessionQuery;
    return this.cartService.getCart(userId, sessionId);
  }

  @Public()
  @Post("items")
  @ApiOperation({ summary: "Add item to cart" })
  async addItem(
    @Body() dto: AddCartItemDto,
    @Headers("x-session-id") sessionHeader?: string,
    @CurrentUser("id") userId?: string,
  ) {
    if (!dto.sessionId && sessionHeader) {
      dto.sessionId = sessionHeader;
    }
    return this.cartService.addItem(dto, userId);
  }

  @Public()
  @Patch("items/:id")
  @ApiOperation({ summary: "Update cart item quantity" })
  async updateItemQuantity(
    @Param("id") itemId: string,
    @Body() dto: UpdateCartItemDto,
    @Headers("x-session-id") sessionId?: string,
    @CurrentUser("id") userId?: string,
  ) {
    return this.cartService.updateItemQuantity(itemId, dto, userId, sessionId);
  }

  @Public()
  @Delete("items/:id")
  @ApiOperation({ summary: "Remove an item from cart" })
  async removeItem(
    @Param("id") itemId: string,
    @Headers("x-session-id") sessionId?: string,
    @CurrentUser("id") userId?: string,
  ) {
    return this.cartService.removeItem(itemId, userId, sessionId);
  }

  @Public()
  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Clear entire cart" })
  async clearCart(
    @Headers("x-session-id") sessionId?: string,
    @CurrentUser("id") userId?: string,
  ) {
    return this.cartService.clearCart(userId, sessionId);
  }
}
