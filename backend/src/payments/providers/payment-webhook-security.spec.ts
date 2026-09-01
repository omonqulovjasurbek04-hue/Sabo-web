import { ConfigService } from "@nestjs/config";
import * as crypto from "crypto";
import { ClickPaymentProvider } from "./click-payment.provider";
import { PaymePaymentProvider } from "./payme-payment.provider";

function configWith(values: Record<string, string>): ConfigService {
  return {
    get: jest.fn((key: string, fallback?: string) => values[key] ?? fallback),
  } as unknown as ConfigService;
}

describe("payment webhook authentication", () => {
  it("rejects a Payme webhook when no merchant secret is configured", async () => {
    const provider = new PaymePaymentProvider(configWith({}));

    const result = await provider.handleWebhook(
      { authorization: "Basic UGF5Y29tOnVuc2FmZQ==" },
      { id: 1, method: "PerformTransaction", params: { account: { order_id: "order-1" } } },
    );

    expect(result.isSuccess).toBe(false);
    expect(result.status).toBe("UNAUTHORIZED");
  });

  it("accepts Payme only with the configured Paycom Basic credential", async () => {
    const provider = new PaymePaymentProvider(
      configWith({ "payments.payme.secret": "payme-secret" }),
    );

    const result = await provider.handleWebhook(
      {
        authorization: `Basic ${Buffer.from("Paycom:payme-secret").toString("base64")}`,
      },
      {
        id: 7,
        method: "PerformTransaction",
        params: { id: "payme-tx", amount: 25_000, account: { order_id: "order-1" } },
      },
    );

    expect(result).toMatchObject({
      isSuccess: true,
      orderId: "order-1",
      externalTransactionId: "payme-tx",
      amountMinor: 25_000,
    });
  });

  it("rejects a Click webhook when its service ID or signature is invalid", async () => {
    const provider = new ClickPaymentProvider(
      configWith({
        "payments.click.serviceId": "123",
        "payments.click.secret": "click-secret",
      }),
    );

    const result = await provider.handleWebhook({}, {
      click_trans_id: "transaction-1",
      service_id: "other-service",
      merchant_trans_id: "order-1",
      amount: "250",
      action: "1",
      sign_time: "2026-09-01 12:00:00",
      sign_string: "invalid",
      error: "0",
    });

    expect(result).toMatchObject({ isSuccess: false, status: "SIGN_ERROR" });
  });

  it("accepts a correctly signed Click webhook for its configured service", async () => {
    const secret = "click-secret";
    const payload = {
      click_trans_id: "transaction-1",
      service_id: "123",
      merchant_trans_id: "order-1",
      amount: "250",
      action: "1",
      sign_time: "2026-09-01 12:00:00",
      error: "0",
    };
    const signString = `${payload.click_trans_id}${payload.service_id}${secret}${payload.merchant_trans_id}${payload.amount}${payload.action}${payload.sign_time}`;
    const provider = new ClickPaymentProvider(
      configWith({
        "payments.click.serviceId": payload.service_id,
        "payments.click.secret": secret,
      }),
    );

    const result = await provider.handleWebhook({}, {
      ...payload,
      sign_string: crypto.createHash("md5").update(signString).digest("hex"),
    });

    expect(result).toMatchObject({
      isSuccess: true,
      orderId: "order-1",
      externalTransactionId: "transaction-1",
      amountMinor: 25_000,
    });
  });
});
