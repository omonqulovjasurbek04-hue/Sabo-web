export interface CreatePaymentInput {
  orderId: string;
  orderNumber: string;
  amountMinor: number;
  currency: string;
  returnUrl?: string;
}

export interface CreatePaymentResult {
  paymentUrl: string;
  externalTransactionId?: string;
  metadata?: Record<string, string>;
}

/** Body returned to the provider verbatim (its format is provider-defined). */
export type WebhookResponse = Record<string, unknown>;

export interface PaymentProvider {
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  handleWebhook(
    headers: Record<string, string | string[] | undefined>,
    payload: Record<string, unknown>,
  ): Promise<WebhookResponse>;
}

/** Order ids are UUIDs; anything else must be rejected before hitting Prisma. */
export const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
