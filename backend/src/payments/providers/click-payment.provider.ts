import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  Order,
  OrderStatus,
  Payment,
  PaymentProviderType,
  PaymentStatus,
  PaymentTransactionType,
  Prisma,
} from "@prisma/client";
import * as crypto from "crypto";
import { PrismaService } from "../../prisma/prisma.service";
import {
  CreatePaymentInput,
  CreatePaymentResult,
  PaymentProvider,
  UUID_PATTERN,
  WebhookResponse,
} from "../interfaces/payment-provider.interface";
import { settleOrderPayment } from "../payment-settlement";

/** Click SHOP API error codes (docs.click.uz → "Click API request"). */
export const ClickError = {
  SUCCESS: 0,
  SIGN_CHECK_FAILED: -1,
  INVALID_AMOUNT: -2,
  ACTION_NOT_FOUND: -3,
  ALREADY_PAID: -4,
  ORDER_NOT_FOUND: -5,
  TRANSACTION_NOT_FOUND: -6,
  BAD_REQUEST: -8,
  TRANSACTION_CANCELLED: -9,
} as const;

const ACTION_PREPARE = 0;
const ACTION_COMPLETE = 1;

const TX_PREPARED = "PREPARED";
const TX_CANCELLED = "CANCELLED";
const TX_COMPLETED = "COMPLETED";

interface ClickPayload {
  click_trans_id: string;
  service_id: string;
  merchant_trans_id: string;
  merchant_prepare_id: string;
  amount: string;
  action: string;
  error: string;
  sign_time: string;
  sign_string: string;
}

type OrderLookup =
  | { ok: false; reply: WebhookResponse }
  | { ok: true; order: Order; payment: Payment };

interface PrepareReference {
  prepareId: number;
}

function field(payload: Record<string, unknown>, key: string): string {
  const value = payload[key];
  return value === undefined || value === null ? "" : String(value);
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

@Injectable()
export class ClickPaymentProvider implements PaymentProvider {
  private readonly logger = new Logger(ClickPaymentProvider.name);
  private readonly serviceId: string;
  private readonly merchantId: string;
  private readonly secret: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.serviceId = this.configService.get<string>(
      "payments.click.serviceId",
      "",
    );
    this.merchantId = this.configService.get<string>(
      "payments.click.merchantId",
      "",
    );
    this.secret = this.configService.get<string>("payments.click.secret", "");
  }

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    // Click expects the amount in sum; orders are stored in tiyin.
    const amountInSum = (input.amountMinor / 100).toFixed(2);
    const frontendUrl = this.configService.get<string>(
      "cors.frontendUrl",
      "http://localhost:3000",
    );
    // Only ever redirect back to our own frontend — an unvalidated returnUrl
    // would let a caller turn Click's checkout into an open redirect.
    const safeReturnUrl =
      input.returnUrl && input.returnUrl.startsWith(frontendUrl)
        ? input.returnUrl
        : `${frontendUrl}/account/orders`;
    const returnUrl = encodeURIComponent(safeReturnUrl);
    const paymentUrl = `https://my.click.uz/services/pay?service_id=${this.serviceId}&merchant_id=${this.merchantId}&amount=${amountInSum}&transaction_param=${input.orderId}&return_url=${returnUrl}`;

    return {
      paymentUrl,
      metadata: { serviceId: this.serviceId, merchantId: this.merchantId },
    };
  }

  /**
   * Handles both Click SHOP API callbacks:
   *  - Prepare  (action=0): validate the order and reserve a prepare id.
   *  - Complete (action=1): settle the payment, or cancel it if Click reports an error.
   * The response body is returned to Click verbatim.
   */
  async handleWebhook(
    _headers: Record<string, string | string[] | undefined>,
    rawPayload: Record<string, unknown>,
  ): Promise<WebhookResponse> {
    const payload: ClickPayload = {
      click_trans_id: field(rawPayload, "click_trans_id"),
      service_id: field(rawPayload, "service_id"),
      merchant_trans_id: field(rawPayload, "merchant_trans_id"),
      merchant_prepare_id: field(rawPayload, "merchant_prepare_id"),
      amount: field(rawPayload, "amount"),
      action: field(rawPayload, "action"),
      error: field(rawPayload, "error"),
      sign_time: field(rawPayload, "sign_time"),
      sign_string: field(rawPayload, "sign_string"),
    };
    const action = Number(payload.action);

    if (!this.verifySignature(payload, action)) {
      this.logger.warn("Click signature verification failed");
      return this.reply(payload, ClickError.SIGN_CHECK_FAILED, "SIGN CHECK FAILED");
    }

    try {
      if (action === ACTION_PREPARE) return await this.prepare(payload);
      if (action === ACTION_COMPLETE) return await this.complete(payload);
      return this.reply(payload, ClickError.ACTION_NOT_FOUND, "Action not found");
    } catch (err) {
      this.logger.error(
        `Click callback failed for transaction ${payload.click_trans_id}`,
        err instanceof Error ? err.stack : undefined,
      );
      return this.reply(payload, ClickError.BAD_REQUEST, "Error in request from click");
    }
  }

  private verifySignature(payload: ClickPayload, action: number): boolean {
    if (!this.secret || !this.serviceId || payload.service_id !== this.serviceId) {
      return false;
    }
    // Complete adds merchant_prepare_id between merchant_trans_id and amount.
    const prepareSegment =
      action === ACTION_COMPLETE ? payload.merchant_prepare_id : "";
    const expected = crypto
      .createHash("md5")
      .update(
        `${payload.click_trans_id}${payload.service_id}${this.secret}${payload.merchant_trans_id}${prepareSegment}${payload.amount}${payload.action}${payload.sign_time}`,
      )
      .digest("hex");
    return safeEqual(payload.sign_string.toLowerCase(), expected);
  }

  private async prepare(payload: ClickPayload): Promise<WebhookResponse> {
    const found = await this.findOrderAndPayment(payload);
    if (!found.ok) return found.reply;
    const { payment } = found;

    if (Number(payload.error) < 0) {
      return this.reply(payload, ClickError.TRANSACTION_CANCELLED, "Transaction cancelled");
    }

    // Click may retry Prepare; answer with the prepare id we already issued.
    const existing = await this.prisma.paymentTransaction.findFirst({
      where: {
        paymentId: payment.id,
        type: PaymentTransactionType.PREPARE,
        externalId: payload.click_trans_id,
      },
    });
    if (existing) {
      if (existing.status === TX_CANCELLED) {
        return this.reply(payload, ClickError.TRANSACTION_CANCELLED, "Transaction cancelled");
      }
      const ref = existing.rawReference as unknown as PrepareReference;
      return this.reply(payload, ClickError.SUCCESS, "Success", {
        merchant_prepare_id: ref.prepareId,
      });
    }

    const prepareId = crypto.randomInt(1, 2_147_483_647);
    await this.prisma.$transaction([
      this.prisma.paymentTransaction.create({
        data: {
          paymentId: payment.id,
          type: PaymentTransactionType.PREPARE,
          externalId: payload.click_trans_id,
          status: TX_PREPARED,
          amountMinor: payment.amountMinor,
          rawReference: { prepareId } satisfies PrepareReference as unknown as Prisma.InputJsonValue,
        },
      }),
      this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.PROCESSING },
      }),
    ]);

    return this.reply(payload, ClickError.SUCCESS, "Success", {
      merchant_prepare_id: prepareId,
    });
  }

  private async complete(payload: ClickPayload): Promise<WebhookResponse> {
    const found = await this.findOrderAndPayment(payload, { allowPaid: true });
    if (!found.ok) return found.reply;
    const { order, payment } = found;

    const prepared = await this.prisma.paymentTransaction.findFirst({
      where: {
        paymentId: payment.id,
        type: PaymentTransactionType.PREPARE,
        externalId: payload.click_trans_id,
      },
    });
    const ref = prepared?.rawReference as unknown as PrepareReference | undefined;
    if (!prepared || String(ref?.prepareId) !== payload.merchant_prepare_id) {
      return this.reply(payload, ClickError.TRANSACTION_NOT_FOUND, "Transaction does not exist");
    }
    if (prepared.status === TX_CANCELLED) {
      return this.reply(payload, ClickError.TRANSACTION_CANCELLED, "Transaction cancelled");
    }

    const confirmReply = () =>
      this.reply(payload, ClickError.SUCCESS, "Success", {
        merchant_confirm_id: ref?.prepareId,
      });

    if (prepared.status === TX_COMPLETED) return confirmReply();
    if (order.paymentStatus === PaymentStatus.PAID) {
      return this.reply(payload, ClickError.ALREADY_PAID, "Already paid");
    }

    // Click reports a failed payment (e.g. insufficient funds) with error < 0.
    if (Number(payload.error) < 0) {
      await this.prisma.$transaction([
        this.prisma.paymentTransaction.update({
          where: { id: prepared.id },
          data: { status: TX_CANCELLED },
        }),
        this.prisma.payment.update({
          where: { id: payment.id },
          data: { status: PaymentStatus.FAILED },
        }),
      ]);
      return this.reply(payload, ClickError.TRANSACTION_CANCELLED, "Transaction cancelled");
    }

    const settled = await this.prisma.$transaction(async (tx) => {
      const marked = await tx.paymentTransaction.updateMany({
        where: { id: prepared.id, status: TX_PREPARED },
        data: { status: TX_COMPLETED },
      });
      if (marked.count === 0) return false;
      await tx.paymentTransaction.create({
        data: {
          paymentId: payment.id,
          type: PaymentTransactionType.COMPLETE,
          externalId: payload.click_trans_id,
          status: TX_COMPLETED,
          amountMinor: payment.amountMinor,
        },
      });
      return settleOrderPayment(tx, {
        orderId: order.id,
        paymentId: payment.id,
        externalTransactionId: payload.click_trans_id,
      });
    });

    if (settled) {
      this.logger.log(`Order ${order.orderNumber} marked as PAID via Click`);
    }
    return confirmReply();
  }

  private async findOrderAndPayment(
    payload: ClickPayload,
    options: { allowPaid?: boolean } = {},
  ): Promise<OrderLookup> {
    const orderId = payload.merchant_trans_id;
    const order = UUID_PATTERN.test(orderId)
      ? await this.prisma.order.findUnique({ where: { id: orderId } })
      : null;
    const payment = order
      ? await this.prisma.payment.findFirst({
          where: { orderId: order.id, provider: PaymentProviderType.CLICK },
          orderBy: { createdAt: "desc" },
        })
      : null;

    if (!order || !payment) {
      return { ok: false, reply: this.reply(payload, ClickError.ORDER_NOT_FOUND, "Order does not exist") };
    }
    if (order.status === OrderStatus.CANCELLED) {
      return { ok: false, reply: this.reply(payload, ClickError.TRANSACTION_CANCELLED, "Transaction cancelled") };
    }
    if (!options.allowPaid && order.paymentStatus === PaymentStatus.PAID) {
      return { ok: false, reply: this.reply(payload, ClickError.ALREADY_PAID, "Already paid") };
    }
    const amountMinor = Math.round(Number.parseFloat(payload.amount) * 100);
    if (!Number.isFinite(amountMinor) || amountMinor !== order.totalMinor) {
      return { ok: false, reply: this.reply(payload, ClickError.INVALID_AMOUNT, "Incorrect parameter amount") };
    }
    return { ok: true, order, payment };
  }

  private reply(
    payload: ClickPayload,
    error: number,
    errorNote: string,
    extra: Record<string, unknown> = {},
  ): WebhookResponse {
    return {
      click_trans_id: payload.click_trans_id,
      merchant_trans_id: payload.merchant_trans_id,
      ...extra,
      error,
      error_note: errorNote,
    };
  }
}
