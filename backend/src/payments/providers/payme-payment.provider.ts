import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  Order,
  OrderStatus,
  Payment,
  PaymentProviderType,
  PaymentStatus,
  PaymentTransaction,
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

/** Payme Merchant API error codes (developer.help.paycom.uz). */
export const PaymeError = {
  INVALID_AMOUNT: -31001,
  TRANSACTION_NOT_FOUND: -31003,
  CANNOT_CANCEL: -31007,
  CANNOT_PERFORM: -31008,
  ORDER_NOT_FOUND: -31050,
  ORDER_UNAVAILABLE: -31051,
  INSUFFICIENT_PRIVILEGE: -32504,
  METHOD_NOT_FOUND: -32601,
  INVALID_REQUEST: -32600,
  INTERNAL: -32400,
} as const;

/** Payme transaction states. */
export const PaymeState = {
  CREATED: 1,
  PERFORMED: 2,
  CANCELLED: -1,
  CANCELLED_AFTER_PERFORM: -2,
} as const;

/** Payme cancels transactions that stay in state 1 longer than 12 hours. */
const TRANSACTION_TIMEOUT_MS = 12 * 60 * 60 * 1000;
const REASON_TIMEOUT = 4;

/** Orders past these statuses have been handed over and can't be refunded via Payme. */
const NON_REFUNDABLE_STATUSES: OrderStatus[] = [
  OrderStatus.OUT_FOR_DELIVERY,
  OrderStatus.DELIVERED,
];

interface PaymeReference {
  paymeTime: number;
  createTime: number;
  performTime: number;
  cancelTime: number;
  reason: number | null;
}

type PaymeTransaction = PaymentTransaction & {
  payment: Payment & { order: Order };
};

class PaymeRpcError extends Error {
  constructor(
    readonly code: number,
    message: string,
    readonly data?: string,
  ) {
    super(message);
  }
}

function localized(message: string) {
  return { uz: message, ru: message, en: message };
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

@Injectable()
export class PaymePaymentProvider implements PaymentProvider {
  private readonly logger = new Logger(PaymePaymentProvider.name);
  private readonly merchantId: string;
  private readonly secret: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.merchantId = this.configService.get<string>(
      "payments.payme.merchantId",
      "",
    );
    this.secret = this.configService.get<string>("payments.payme.secret", "");
  }

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    // Payme works in tiyin (1 sum = 100 tiyin), the same unit as amountMinor.
    const params = `m=${this.merchantId};ac.order_id=${input.orderId};a=${input.amountMinor}`;
    const base64Params = Buffer.from(params).toString("base64");
    const paymentUrl = `https://checkout.paycom.uz/${base64Params}`;

    return {
      paymentUrl,
      metadata: { merchantId: this.merchantId },
    };
  }

  /** JSON-RPC 2.0 entry point for the Payme Merchant API. */
  async handleWebhook(
    headers: Record<string, string | string[] | undefined>,
    payload: Record<string, unknown>,
  ): Promise<WebhookResponse> {
    const id = payload.id ?? null;

    if (!this.isAuthorized(headers.authorization)) {
      return this.errorReply(
        id,
        new PaymeRpcError(PaymeError.INSUFFICIENT_PRIVILEGE, "Insufficient privileges"),
      );
    }

    const method = typeof payload.method === "string" ? payload.method : "";
    const params = asRecord(payload.params);

    try {
      const result = await this.dispatch(method, params);
      return { result, id };
    } catch (err) {
      if (err instanceof PaymeRpcError) return this.errorReply(id, err);
      this.logger.error(
        `Payme ${method} failed`,
        err instanceof Error ? err.stack : undefined,
      );
      return this.errorReply(id, new PaymeRpcError(PaymeError.INTERNAL, "Internal error"));
    }
  }

  private isAuthorized(header: string | string[] | undefined): boolean {
    // A webhook must never be accepted without a configured secret and valid
    // Basic credentials, otherwise anyone could post PerformTransaction.
    if (!this.secret || typeof header !== "string" || !header.startsWith("Basic ")) {
      return false;
    }
    const decoded = Buffer.from(header.slice(6), "base64").toString("utf-8");
    const separator = decoded.indexOf(":");
    if (separator < 0) return false;
    const username = decoded.slice(0, separator);
    const providedSecret = decoded.slice(separator + 1);
    return username === "Paycom" && safeEqual(providedSecret, this.secret);
  }

  private dispatch(method: string, params: Record<string, unknown>) {
    switch (method) {
      case "CheckPerformTransaction":
        return this.checkPerformTransaction(params);
      case "CreateTransaction":
        return this.createTransaction(params);
      case "PerformTransaction":
        return this.performTransaction(params);
      case "CancelTransaction":
        return this.cancelTransaction(params);
      case "CheckTransaction":
        return this.checkTransaction(params);
      case "GetStatement":
        return this.getStatement(params);
      default:
        throw new PaymeRpcError(PaymeError.METHOD_NOT_FOUND, "Method not found", method);
    }
  }

  private async checkPerformTransaction(params: Record<string, unknown>) {
    await this.validateOrder(params);
    return { allow: true };
  }

  private async createTransaction(params: Record<string, unknown>) {
    const paymeId = this.requireString(params.id, "id");
    const existing = await this.findTransaction(paymeId);

    if (existing) {
      const ref = this.ref(existing);
      if (Number(existing.status) !== PaymeState.CREATED) {
        throw new PaymeRpcError(PaymeError.CANNOT_PERFORM, "Transaction is not active");
      }
      if (Date.now() - ref.createTime > TRANSACTION_TIMEOUT_MS) {
        await this.cancel(existing, PaymeState.CANCELLED, REASON_TIMEOUT);
        throw new PaymeRpcError(PaymeError.CANNOT_PERFORM, "Transaction timed out");
      }
      return {
        create_time: ref.createTime,
        transaction: existing.id,
        state: PaymeState.CREATED,
      };
    }

    const { order, payment } = await this.validateOrder(params);

    // Only one active Payme transaction per order: a second one means the
    // account is busy and must be rejected.
    const active = await this.prisma.paymentTransaction.findFirst({
      where: {
        paymentId: payment.id,
        type: PaymentTransactionType.INITIATE,
        status: String(PaymeState.CREATED),
      },
    });
    if (active) {
      throw new PaymeRpcError(
        PaymeError.ORDER_UNAVAILABLE,
        "Another transaction is in progress for this order",
        "order_id",
      );
    }

    const createTime = Date.now();
    const reference: PaymeReference = {
      paymeTime: Number(params.time) || createTime,
      createTime,
      performTime: 0,
      cancelTime: 0,
      reason: null,
    };
    const created = await this.prisma.$transaction(async (tx) => {
      const row = await tx.paymentTransaction.create({
        data: {
          paymentId: payment.id,
          type: PaymentTransactionType.INITIATE,
          externalId: paymeId,
          status: String(PaymeState.CREATED),
          amountMinor: order.totalMinor,
          rawReference: reference as unknown as Prisma.InputJsonValue,
        },
      });
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.PROCESSING },
      });
      return row;
    });

    return {
      create_time: createTime,
      transaction: created.id,
      state: PaymeState.CREATED,
    };
  }

  private async performTransaction(params: Record<string, unknown>) {
    const transaction = await this.requireTransaction(params);
    const ref = this.ref(transaction);
    const state = Number(transaction.status);

    if (state === PaymeState.PERFORMED) {
      return { transaction: transaction.id, perform_time: ref.performTime, state };
    }
    if (state !== PaymeState.CREATED) {
      throw new PaymeRpcError(PaymeError.CANNOT_PERFORM, "Transaction is not active");
    }
    if (Date.now() - ref.createTime > TRANSACTION_TIMEOUT_MS) {
      await this.cancel(transaction, PaymeState.CANCELLED, REASON_TIMEOUT);
      throw new PaymeRpcError(PaymeError.CANNOT_PERFORM, "Transaction timed out");
    }

    const performTime = Date.now();
    const performed = await this.prisma.$transaction(async (tx) => {
      const marked = await tx.paymentTransaction.updateMany({
        where: { id: transaction.id, status: String(PaymeState.CREATED) },
        data: {
          status: String(PaymeState.PERFORMED),
          rawReference: { ...ref, performTime } as unknown as Prisma.InputJsonValue,
        },
      });
      if (marked.count === 0) return false;
      const settled = await settleOrderPayment(tx, {
        orderId: transaction.payment.orderId,
        paymentId: transaction.paymentId,
        externalTransactionId: transaction.externalId ?? transaction.id,
      });
      if (!settled) {
        // Order was cancelled or paid elsewhere meanwhile — abort the perform.
        throw new PaymeRpcError(PaymeError.CANNOT_PERFORM, "Order can no longer be paid");
      }
      return true;
    });

    if (!performed) {
      // Lost a race with a concurrent Perform/Cancel; report the current state.
      return this.checkTransaction(params);
    }
    this.logger.log(
      `Order ${transaction.payment.order.orderNumber} marked as PAID via Payme`,
    );
    return {
      transaction: transaction.id,
      perform_time: performTime,
      state: PaymeState.PERFORMED,
    };
  }

  private async cancelTransaction(params: Record<string, unknown>) {
    const transaction = await this.requireTransaction(params);
    const state = Number(transaction.status);
    const reason = Number(params.reason) || null;

    if (state === PaymeState.CREATED) {
      return this.cancel(transaction, PaymeState.CANCELLED, reason);
    }
    if (state === PaymeState.PERFORMED) {
      if (NON_REFUNDABLE_STATUSES.includes(transaction.payment.order.status)) {
        throw new PaymeRpcError(PaymeError.CANNOT_CANCEL, "Order has already been fulfilled");
      }
      return this.cancel(transaction, PaymeState.CANCELLED_AFTER_PERFORM, reason);
    }
    const ref = this.ref(transaction);
    return { transaction: transaction.id, cancel_time: ref.cancelTime, state };
  }

  private async checkTransaction(params: Record<string, unknown>) {
    const transaction = await this.requireTransaction(params);
    const ref = this.ref(transaction);
    return {
      create_time: ref.createTime,
      perform_time: ref.performTime,
      cancel_time: ref.cancelTime,
      transaction: transaction.id,
      state: Number(transaction.status),
      reason: ref.reason,
    };
  }

  private async getStatement(params: Record<string, unknown>) {
    const from = Number(params.from);
    const to = Number(params.to);
    if (!Number.isFinite(from) || !Number.isFinite(to)) {
      throw new PaymeRpcError(PaymeError.INVALID_REQUEST, "Invalid period");
    }

    const rows = await this.prisma.paymentTransaction.findMany({
      where: {
        type: PaymentTransactionType.INITIATE,
        payment: { provider: PaymentProviderType.PAYME },
        createdAt: { gte: new Date(from), lte: new Date(to) },
      },
      include: { payment: true },
      orderBy: { createdAt: "asc" },
    });

    return {
      transactions: rows.map((row) => {
        const ref = row.rawReference as unknown as PaymeReference;
        return {
          id: row.externalId,
          time: ref.paymeTime,
          amount: row.amountMinor,
          account: { order_id: row.payment.orderId },
          create_time: ref.createTime,
          perform_time: ref.performTime,
          cancel_time: ref.cancelTime,
          transaction: row.id,
          state: Number(row.status),
          reason: ref.reason,
        };
      }),
    };
  }

  private async cancel(
    transaction: PaymeTransaction,
    state: number,
    reason: number | null,
  ) {
    const ref = this.ref(transaction);
    const cancelTime = Date.now();
    const wasPerformed = state === PaymeState.CANCELLED_AFTER_PERFORM;

    await this.prisma.$transaction(async (tx) => {
      await tx.paymentTransaction.update({
        where: { id: transaction.id },
        data: {
          status: String(state),
          rawReference: { ...ref, cancelTime, reason } as unknown as Prisma.InputJsonValue,
        },
      });
      await tx.payment.update({
        where: { id: transaction.paymentId },
        data: {
          status: wasPerformed ? PaymentStatus.REFUNDED : PaymentStatus.FAILED,
        },
      });
      if (wasPerformed) {
        await tx.order.update({
          where: { id: transaction.payment.orderId },
          data: { paymentStatus: PaymentStatus.REFUNDED },
        });
      }
    });

    return { transaction: transaction.id, cancel_time: cancelTime, state };
  }

  private async validateOrder(params: Record<string, unknown>) {
    const account = asRecord(params.account);
    const orderId = typeof account.order_id === "string" ? account.order_id : "";
    const order = UUID_PATTERN.test(orderId)
      ? await this.prisma.order.findUnique({ where: { id: orderId } })
      : null;
    const payment = order
      ? await this.prisma.payment.findFirst({
          where: { orderId: order.id, provider: PaymentProviderType.PAYME },
          orderBy: { createdAt: "desc" },
        })
      : null;

    if (!order || !payment) {
      throw new PaymeRpcError(PaymeError.ORDER_NOT_FOUND, "Order not found", "order_id");
    }
    if (
      order.status === OrderStatus.CANCELLED ||
      order.paymentStatus === PaymentStatus.PAID
    ) {
      throw new PaymeRpcError(PaymeError.ORDER_UNAVAILABLE, "Order cannot be paid", "order_id");
    }
    if (Number(params.amount) !== order.totalMinor) {
      throw new PaymeRpcError(PaymeError.INVALID_AMOUNT, "Incorrect amount");
    }
    return { order, payment };
  }

  private async requireTransaction(params: Record<string, unknown>) {
    const transaction = await this.findTransaction(this.requireString(params.id, "id"));
    if (!transaction) {
      throw new PaymeRpcError(PaymeError.TRANSACTION_NOT_FOUND, "Transaction not found");
    }
    return transaction;
  }

  private findTransaction(paymeId: string): Promise<PaymeTransaction | null> {
    return this.prisma.paymentTransaction.findFirst({
      where: {
        externalId: paymeId,
        type: PaymentTransactionType.INITIATE,
        payment: { provider: PaymentProviderType.PAYME },
      },
      include: { payment: { include: { order: true } } },
    });
  }

  private requireString(value: unknown, name: string): string {
    if (typeof value !== "string" || value.length === 0) {
      throw new PaymeRpcError(PaymeError.INVALID_REQUEST, `Missing ${name}`, name);
    }
    return value;
  }

  private ref(transaction: PaymentTransaction): PaymeReference {
    return transaction.rawReference as unknown as PaymeReference;
  }

  private errorReply(id: unknown, err: PaymeRpcError): WebhookResponse {
    return {
      error: {
        code: err.code,
        message: localized(err.message),
        ...(err.data ? { data: err.data } : {}),
      },
      id,
    };
  }
}
