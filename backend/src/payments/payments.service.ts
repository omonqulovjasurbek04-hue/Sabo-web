import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { PaymentProviderType, PaymentStatus } from "@prisma/client";
import { ErrorCode } from "../common/enums/error-code.enum";
import { PrismaService } from "../prisma/prisma.service";
import {
  CreatePaymentResult,
  WebhookResponse,
} from "./interfaces/payment-provider.interface";
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
    userId?: string,
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

    if (!userId || order.userId !== userId) {
      throw new ForbiddenException({
        code: ErrorCode.AUTH_FORBIDDEN,
        message: "You cannot create a payment link for this order",
      });
    }

    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException({
        code: ErrorCode.ORDER_ALREADY_PAID,
        message: "Order is already paid",
      });
    }

    let result: CreatePaymentResult;
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

    // Update payment record: update the existing one for this order if present,
    // otherwise create a new one. (A literal "new" id can't be used with upsert
    // since Payment.id is a real @db.Uuid column.)
    const existingPayment = order.payments[0];
    if (existingPayment) {
      await this.prisma.payment.update({
        where: { id: existingPayment.id },
        data: {
          provider,
          paymentUrl: result.paymentUrl,
          metadata: result.metadata,
        },
      });
    } else {
      await this.prisma.payment.create({
        data: {
          orderId: order.id,
          provider,
          amountMinor: order.totalMinor,
          currency: order.currency,
          paymentUrl: result.paymentUrl,
          metadata: result.metadata,
        },
      });
    }

    return result;
  }

  /** Dispatches a provider callback; the returned body is sent to the provider verbatim. */
  async processWebhook(
    provider: string,
    headers: Record<string, string | string[] | undefined>,
    payload: Record<string, unknown>,
  ): Promise<WebhookResponse> {
    const name = provider.toLowerCase();
    this.logger.log(`Processing payment webhook from provider: ${name}`);

    if (name === "click") {
      return this.clickProvider.handleWebhook(headers, payload);
    }
    if (name === "payme") {
      return this.paymeProvider.handleWebhook(headers, payload);
    }
    throw new NotFoundException(`Unknown payment provider: ${provider}`);
  }
}
