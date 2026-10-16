import {
  OrderStatus,
  PaymentProviderType,
  PaymentStatus,
} from "@prisma/client";
import * as crypto from "crypto";
import {
  configWith,
  createFakeStore,
  ORDER_ID,
} from "../testing/fake-payment-store";
import { ClickError, ClickPaymentProvider } from "./click-payment.provider";
import { PaymeError, PaymePaymentProvider, PaymeState } from "./payme-payment.provider";

const CLICK_SECRET = "click-secret";
const CLICK_SERVICE = "123";

function clickSign(p: Record<string, string>, includePrepareId: boolean): string {
  const prepare = includePrepareId ? p.merchant_prepare_id : "";
  return crypto
    .createHash("md5")
    .update(
      `${p.click_trans_id}${p.service_id}${CLICK_SECRET}${p.merchant_trans_id}${prepare}${p.amount}${p.action}${p.sign_time}`,
    )
    .digest("hex");
}

function clickPayload(action: 0 | 1, overrides: Record<string, string> = {}) {
  const payload: Record<string, string> = {
    click_trans_id: "777",
    service_id: CLICK_SERVICE,
    merchant_trans_id: ORDER_ID,
    amount: "25000.00",
    action: String(action),
    error: "0",
    sign_time: "2026-10-16 12:00:00",
    ...overrides,
  };
  payload.sign_string = clickSign(payload, action === 1);
  return payload;
}

function setupClick() {
  const store = createFakeStore(PaymentProviderType.CLICK);
  const provider = new ClickPaymentProvider(
    configWith({
      "payments.click.serviceId": CLICK_SERVICE,
      "payments.click.secret": CLICK_SECRET,
    }),
    store.prisma,
  );
  return { store, provider };
}

describe("Click SHOP API webhook", () => {
  it("rejects an invalid signature", async () => {
    const { provider } = setupClick();
    const result = await provider.handleWebhook({}, {
      ...clickPayload(0),
      sign_string: "invalid",
    });
    expect(result.error).toBe(ClickError.SIGN_CHECK_FAILED);
  });

  it("rejects callbacks for another service id", async () => {
    const { provider } = setupClick();
    const result = await provider.handleWebhook({}, clickPayload(0, { service_id: "999" }));
    expect(result.error).toBe(ClickError.SIGN_CHECK_FAILED);
  });

  it("does NOT mark the order paid on Prepare", async () => {
    const { provider, store } = setupClick();
    const result = await provider.handleWebhook({}, clickPayload(0));

    expect(result.error).toBe(ClickError.SUCCESS);
    expect(typeof result.merchant_prepare_id).toBe("number");
    expect(store.orders[0].paymentStatus).toBe(PaymentStatus.PENDING);
  });

  it("rejects Prepare with a wrong amount or unknown order", async () => {
    const { provider } = setupClick();
    const wrongAmount = await provider.handleWebhook({}, clickPayload(0, { amount: "1.00" }));
    expect(wrongAmount.error).toBe(ClickError.INVALID_AMOUNT);

    const unknown = await provider.handleWebhook(
      {},
      clickPayload(0, { merchant_trans_id: "not-a-uuid" }),
    );
    expect(unknown.error).toBe(ClickError.ORDER_NOT_FOUND);
  });

  it("settles the order on Complete and is idempotent on retry", async () => {
    const { provider, store } = setupClick();
    const prepare = await provider.handleWebhook({}, clickPayload(0));
    const prepareId = String(prepare.merchant_prepare_id);

    const complete = clickPayload(1, { merchant_prepare_id: prepareId });
    const first = await provider.handleWebhook({}, complete);
    const retry = await provider.handleWebhook({}, complete);

    expect(first.error).toBe(ClickError.SUCCESS);
    expect(first.merchant_confirm_id).toBe(prepare.merchant_prepare_id);
    expect(retry.error).toBe(ClickError.SUCCESS);
    expect(store.orders[0]).toMatchObject({
      paymentStatus: PaymentStatus.PAID,
      status: OrderStatus.CONFIRMED,
    });
    expect(store.payments[0]).toMatchObject({
      status: PaymentStatus.PAID,
      externalTransactionId: "777",
    });
  });

  it("rejects Complete signed with the Prepare formula", async () => {
    const { provider } = setupClick();
    const prepare = await provider.handleWebhook({}, clickPayload(0));
    const payload = clickPayload(1, { merchant_prepare_id: String(prepare.merchant_prepare_id) });
    payload.sign_string = clickSign(payload, false);

    const result = await provider.handleWebhook({}, payload);
    expect(result.error).toBe(ClickError.SIGN_CHECK_FAILED);
  });

  it("rejects Complete with an unknown prepare id", async () => {
    const { provider, store } = setupClick();
    await provider.handleWebhook({}, clickPayload(0));
    const result = await provider.handleWebhook(
      {},
      clickPayload(1, { merchant_prepare_id: "42" }),
    );
    expect(result.error).toBe(ClickError.TRANSACTION_NOT_FOUND);
    expect(store.orders[0].paymentStatus).toBe(PaymentStatus.PENDING);
  });

  it("cancels the transaction when Click reports a failed payment", async () => {
    const { provider, store } = setupClick();
    const prepare = await provider.handleWebhook({}, clickPayload(0));
    const result = await provider.handleWebhook(
      {},
      clickPayload(1, {
        merchant_prepare_id: String(prepare.merchant_prepare_id),
        error: "-5017",
      }),
    );

    expect(result.error).toBe(ClickError.TRANSACTION_CANCELLED);
    expect(store.orders[0].paymentStatus).toBe(PaymentStatus.PENDING);
    expect(store.payments[0].status).toBe(PaymentStatus.FAILED);
  });
});

const PAYME_SECRET = "payme-secret";
const paymeAuth = {
  authorization: `Basic ${Buffer.from(`Paycom:${PAYME_SECRET}`).toString("base64")}`,
};

function setupPayme(secret = PAYME_SECRET) {
  const store = createFakeStore(PaymentProviderType.PAYME);
  const provider = new PaymePaymentProvider(
    configWith(secret ? { "payments.payme.secret": secret } : {}),
    store.prisma,
  );
  const call = (method: string, params: Record<string, unknown>, headers = paymeAuth) =>
    provider.handleWebhook(headers, { id: 1, method, params });
  return { store, provider, call };
}

const account = { order_id: ORDER_ID };

describe("Payme Merchant API webhook", () => {
  it("rejects requests when no merchant secret is configured", async () => {
    const { call } = setupPayme("");
    const result = await call("CheckPerformTransaction", { amount: 2_500_000, account });
    expect(result.error).toMatchObject({ code: PaymeError.INSUFFICIENT_PRIVILEGE });
  });

  it("rejects requests with wrong Basic credentials", async () => {
    const { call } = setupPayme();
    const result = await call(
      "CheckPerformTransaction",
      { amount: 2_500_000, account },
      { authorization: `Basic ${Buffer.from("Paycom:wrong").toString("base64")}` },
    );
    expect(result.error).toMatchObject({ code: PaymeError.INSUFFICIENT_PRIVILEGE });
  });

  it("validates amount and order in CheckPerformTransaction", async () => {
    const { call } = setupPayme();
    expect(await call("CheckPerformTransaction", { amount: 2_500_000, account })).toMatchObject({
      result: { allow: true },
    });
    expect(
      (await call("CheckPerformTransaction", { amount: 1, account })).error,
    ).toMatchObject({ code: PaymeError.INVALID_AMOUNT });
    expect(
      (await call("CheckPerformTransaction", {
        amount: 2_500_000,
        account: { order_id: "missing" },
      })).error,
    ).toMatchObject({ code: PaymeError.ORDER_NOT_FOUND });
  });

  it("refuses PerformTransaction for a transaction that was never created", async () => {
    const { call, store } = setupPayme();
    const result = await call("PerformTransaction", { id: "forged" });
    expect(result.error).toMatchObject({ code: PaymeError.TRANSACTION_NOT_FOUND });
    expect(store.orders[0].paymentStatus).toBe(PaymentStatus.PENDING);
  });

  it("runs Create → Perform → Check and settles the order once", async () => {
    const { call, store } = setupPayme();
    const created = await call("CreateTransaction", {
      id: "payme-1",
      time: Date.now(),
      amount: 2_500_000,
      account,
    });
    expect(created.result).toMatchObject({ state: PaymeState.CREATED });
    expect(store.orders[0].paymentStatus).toBe(PaymentStatus.PENDING);

    const performed = await call("PerformTransaction", { id: "payme-1" });
    const again = await call("PerformTransaction", { id: "payme-1" });
    expect(performed.result).toMatchObject({ state: PaymeState.PERFORMED });
    expect(again.result).toMatchObject({ state: PaymeState.PERFORMED });
    expect(store.orders[0]).toMatchObject({
      paymentStatus: PaymentStatus.PAID,
      status: OrderStatus.CONFIRMED,
    });

    const checked = await call("CheckTransaction", { id: "payme-1" });
    expect(checked.result).toMatchObject({ state: PaymeState.PERFORMED, reason: null });
  });

  it("rejects a second active transaction for the same order", async () => {
    const { call } = setupPayme();
    await call("CreateTransaction", { id: "payme-1", time: Date.now(), amount: 2_500_000, account });
    const second = await call("CreateTransaction", {
      id: "payme-2",
      time: Date.now(),
      amount: 2_500_000,
      account,
    });
    expect(second.error).toMatchObject({ code: PaymeError.ORDER_UNAVAILABLE });
  });

  it("cancels a created transaction without touching the order", async () => {
    const { call, store } = setupPayme();
    await call("CreateTransaction", { id: "payme-1", time: Date.now(), amount: 2_500_000, account });
    const cancelled = await call("CancelTransaction", { id: "payme-1", reason: 3 });

    expect(cancelled.result).toMatchObject({ state: PaymeState.CANCELLED });
    expect(store.orders[0].paymentStatus).toBe(PaymentStatus.PENDING);
    expect(store.payments[0].status).toBe(PaymentStatus.FAILED);
  });

  it("refunds after perform unless the order was already delivered", async () => {
    const { call, store } = setupPayme();
    await call("CreateTransaction", { id: "payme-1", time: Date.now(), amount: 2_500_000, account });
    await call("PerformTransaction", { id: "payme-1" });

    store.orders[0].status = OrderStatus.DELIVERED;
    const refused = await call("CancelTransaction", { id: "payme-1", reason: 5 });
    expect(refused.error).toMatchObject({ code: PaymeError.CANNOT_CANCEL });

    store.orders[0].status = OrderStatus.CONFIRMED;
    const refunded = await call("CancelTransaction", { id: "payme-1", reason: 5 });
    expect(refunded.result).toMatchObject({ state: PaymeState.CANCELLED_AFTER_PERFORM });
    expect(store.orders[0].paymentStatus).toBe(PaymentStatus.REFUNDED);
  });

  it("returns METHOD_NOT_FOUND for unknown methods", async () => {
    const { call } = setupPayme();
    const result = await call("DropDatabase", {});
    expect(result.error).toMatchObject({ code: PaymeError.METHOD_NOT_FOUND });
  });
});
