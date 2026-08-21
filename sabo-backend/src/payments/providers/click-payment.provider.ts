import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import {
  CreatePaymentInput,
  CreatePaymentResult,
  PaymentProvider,
  WebhookResult,
} from '../interfaces/payment-provider.interface';

@Injectable()
export class ClickPaymentProvider implements PaymentProvider {
  private readonly logger = new Logger(ClickPaymentProvider.name);
  private readonly serviceId: string;
  private readonly merchantId: string;
  private readonly secret: string;

  constructor(private readonly configService: ConfigService) {
    this.serviceId = this.configService.get<string>('payments.click.serviceId', '');
    this.merchantId = this.configService.get<string>('payments.click.merchantId', '');
    this.secret = this.configService.get<string>('payments.click.secret', '');
  }

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    // In minor units / sums
    const amountInSum = (input.amountMinor / 100).toFixed(2);
    const returnUrl = encodeURIComponent(input.returnUrl || 'http://localhost:3000/account/orders');
    const paymentUrl = `https://my.click.uz/services/pay?service_id=${this.serviceId}&merchant_id=${this.merchantId}&amount=${amountInSum}&transaction_param=${input.orderId}&return_url=${returnUrl}`;

    return {
      paymentUrl,
      metadata: { serviceId: this.serviceId, merchantId: this.merchantId },
    };
  }

  async verifyPayment(externalTransactionId: string): Promise<boolean> {
    this.logger.log(`Verifying Click payment: ${externalTransactionId}`);
    return true;
  }

  async handleWebhook(headers: Record<string, any>, payload: Record<string, any>): Promise<WebhookResult> {
    // Click Webhook Prepare / Complete
    const { click_trans_id, service_id, merchant_trans_id, amount, action, error, sign_time, sign_string } = payload;

    // Signature verification: MD5(click_trans_id + service_id + SECRET + merchant_trans_id + amount + action + sign_time)
    const expectedSign = crypto
      .createHash('md5')
      .update(`${click_trans_id}${service_id}${this.secret}${merchant_trans_id}${amount}${action}${sign_time}`)
      .digest('hex');

    if (this.secret && sign_string !== expectedSign) {
      this.logger.warn(`Click signature mismatch. Expected: ${expectedSign}, Received: ${sign_string}`);
      return {
        isSuccess: false,
        status: 'SIGN_ERROR',
        responsePayload: { error: -1, error_note: 'Sign check failed' },
      };
    }

    const isSuccess = error === '0' || error === 0;

    return {
      isSuccess,
      orderId: merchant_trans_id,
      externalTransactionId: click_trans_id ? click_trans_id.toString() : undefined,
      amountMinor: amount ? Math.round(parseFloat(amount) * 100) : undefined,
      status: isSuccess ? 'SUCCESS' : 'FAILED',
      responsePayload: {
        click_trans_id,
        merchant_trans_id,
        merchant_prepare_id: merchant_trans_id,
        error: isSuccess ? 0 : -1,
        error_note: isSuccess ? 'Success' : 'Failed',
      },
    };
  }
}
