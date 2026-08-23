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
  metadata?: Record<string, any>;
}

export interface WebhookResult {
  isSuccess: boolean;
  orderId?: string;
  externalTransactionId?: string;
  amountMinor?: number;
  status: string;
  responsePayload: Record<string, any>;
}

export interface PaymentProvider {
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  verifyPayment(externalTransactionId: string): Promise<boolean>;
  handleWebhook(
    headers: Record<string, any>,
    payload: Record<string, any>,
  ): Promise<WebhookResult>;
}
