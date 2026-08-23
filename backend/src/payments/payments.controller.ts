import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { PaymentProviderType } from "@prisma/client";
import { JwtAuthGuard, Public } from "../common/guards/jwt-auth.guard";
import { PaymentsService } from "./payments.service";

@ApiTags("Payments")
@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post("checkout-url")
  @ApiOperation({ summary: "Generate checkout URL for Click or Payme" })
  async getPaymentUrl(
    @Body()
    dto: {
      orderId: string;
      provider: PaymentProviderType;
      returnUrl?: string;
    },
  ) {
    return this.paymentsService.createPaymentUrl(
      dto.orderId,
      dto.provider,
      dto.returnUrl,
    );
  }

  @Public()
  @Post(":provider/webhook")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Payment provider webhook endpoint (Click / Payme)",
  })
  @ApiResponse({
    status: 200,
    description: "Webhook processed with verification",
  })
  async handleWebhook(
    @Param("provider") provider: string,
    @Headers() headers: Record<string, any>,
    @Body() payload: Record<string, any>,
  ) {
    return this.paymentsService.processWebhook(provider, headers, payload);
  }
}
