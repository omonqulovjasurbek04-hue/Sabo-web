import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import {
  OrderStatus,
  PaymentProviderType,
  PaymentStatus,
} from "@prisma/client";
import { ErrorCode } from "../common/enums/error-code.enum";
import { PrismaService } from "../prisma/prisma.service";
import { ClickPaymentProvider } from "./providers/click-payment.provider";
import { PaymePaymentProvider } from "./providers/payme-payment.provider";

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly clickProvider: ClickPaymentProvider,
    private readonly paymeProvider: PaymePaymentProvider,
  ) {}

  async createPaymentUrl(
    orderId: string,
    provider: PaymentProviderType,
    returnUrl?: string,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payments: true },
    });

    if (!order) {
      throw new NotFoundException({
        code: ErrorCode.ORDER_NOT_FOUND,
        message: "Order not found",
      });
    }

    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException({
        code: ErrorCode.ORDER_ALREADY_PAID,
        message: "Order is already paid",
      });
    }

    let result;
    const input = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      amountMinor: order.totalMinor,
      currency: order.currency,
      returnUrl,
    };

    if (provider === PaymentProviderType.CLICK) {
      result = await this.clickProvider.createPayment(input);
    } else if (provider === PaymentProviderType.PAYME) {
      result = await this.paymeProvider.createPayment(input);
    } else {
      // CASH or MANUAL
      return {
        paymentUrl: null,
        status: PaymentStatus.PENDING,
        message: "Cash on delivery selected",
      };
    }

    // Update payment record
    await this.prisma.payment.upsert({
      where: { id: order.payments[0]?.id || "new" },
      update: {
        provider,
        paymentUrl: result.paymentUrl,
        metadata: result.metadata,
      },
      create: {
        orderId: order.id,
        provider,
        amountMinor: order.totalMinor,
        currency: order.currency,
        paymentUrl: result.paymentUrl,
        metadata: result.metadata,
      },
    });

    return result;
  }

  async processWebhook(
    provider: string,
    headers: Record<string, any>,
    payload: Record<string, any>,
  ) {
    this.logger.log(`Processing payment webhook from provider: ${provider}`);

    let webhookResult;
    if (provider.toLowerCase() === "click") {
      webhookResult = await this.clickProvider.handleWebhook(headers, payload);
    } else if (provider.toLowerCase() === "payme") {
      webhookResult = await this.paymeProvider.handleWebhook(headers, payload);
    } else {
      throw new BadRequestException(`Unknown payment provider: ${provider}`);
    }

    if (webhookResult.isSuccess && webhookResult.orderId) {
      // Update order and payment status atomically
      await this.prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
          where: { id: webhookResult.orderId },
        });

        if (order && order.paymentStatus !== PaymentStatus.PAID) {
          await tx.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: PaymentStatus.PAID,
              status:
                order.status === OrderStatus.PENDING
                  ? OrderStatus.CONFIRMED
                  : order.status,
            },
          });

          await tx.payment.updateMany({
            where: { orderId: order.id },
            data: {
              status: PaymentStatus.PAID,
              externalTransactionId:
                webhookResult.externalTransactionId || null,
            },
          });

          this.logger.log(
            `✅ Order ${order.orderNumber} successfully marked as PAID via ${provider}`,
          );
        }
      });
    }

    return webhookResult.responsePayload;
  }
}
