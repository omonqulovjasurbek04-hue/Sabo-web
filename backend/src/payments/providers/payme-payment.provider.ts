import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  CreatePaymentInput,
  CreatePaymentResult,
  PaymentProvider,
  WebhookResult,
} from "../interfaces/payment-provider.interface";

@Injectable()
export class PaymePaymentProvider implements PaymentProvider {
  private readonly logger = new Logger(PaymePaymentProvider.name);
  private readonly merchantId: string;
  private readonly secret: string;

  constructor(private readonly configService: ConfigService) {
    this.merchantId = this.configService.get<string>(
      "payments.payme.merchantId",
      "",
    );
    this.secret = this.configService.get<string>("payments.payme.secret", "");
  }

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    // In tiyin (1 sum = 100 tiyin)
    const amountInTiyin = input.amountMinor;
    const params = `m=${this.merchantId};ac.order_id=${input.orderId};a=${amountInTiyin}`;
    const base64Params = Buffer.from(params).toString("base64");
    const paymentUrl = `https://checkout.paycom.uz/${base64Params}`;

    return {
      paymentUrl,
      metadata: { merchantId: this.merchantId },
    };
  }

  async verifyPayment(externalTransactionId: string): Promise<boolean> {
    this.logger.log(`Verifying Payme transaction: ${externalTransactionId}`);
    return true;
  }

  async handleWebhook(
    headers: Record<string, any>,
    payload: Record<string, any>,
  ): Promise<WebhookResult> {
    // Payme JSON-RPC 2.0 Webhook Protocol
    const { method, params, id } = payload;
    const authHeader = headers["authorization"];

    // Verify HTTP Basic Auth "Paycom:SECRET"
    if (this.secret && authHeader) {
      const encoded = authHeader.replace("Basic ", "");
      const decoded = Buffer.from(encoded, "base64").toString("utf-8");
      const [, providedSecret] = decoded.split(":");
      if (providedSecret !== this.secret) {
        return {
          isSuccess: false,
          status: "UNAUTHORIZED",
          responsePayload: {
            error: { code: -32504, message: "Insufficient privileges" },
            id,
          },
        };
      }
    }

    const orderId = params?.account?.order_id;
    const isPerformTransaction = method === "PerformTransaction";

    return {
      isSuccess: isPerformTransaction,
      orderId,
      externalTransactionId: params?.id,
      amountMinor: params?.amount,
      status: isPerformTransaction ? "SUCCESS" : "PENDING",
      responsePayload: {
        result: {
          transaction: params?.id || "tx_stub",
          perform_time: Date.now(),
          state: 2,
        },
        id,
      },
    };
  }
}
