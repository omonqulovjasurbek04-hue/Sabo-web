import { isThrottleExempt, parseTrustProxy } from "./throttle.config";

describe("isThrottleExempt", () => {
  it.each([
    "/api/v1/payments/click/webhook",
    "/api/v1/payments/payme/webhook/",
    "/api/v1/payments/click/webhook?x=1",
    "/api/v1/health",
  ])("exempts %s", (path) => {
    expect(isThrottleExempt(path)).toBe(true);
  });

  it.each([
    "/api/v1/payments/checkout-url",
    "/api/v1/orders",
    "/api/v1/auth/login",
    "/api/v1/products/health-drink",
  ])("throttles %s", (path) => {
    expect(isThrottleExempt(path)).toBe(false);
  });
});

describe("parseTrustProxy", () => {
  it("defaults to one hop in production and off elsewhere", () => {
    expect(parseTrustProxy(undefined, "production")).toBe(1);
    expect(parseTrustProxy("", "development")).toBe(false);
  });

  it("parses booleans, hop counts and address lists", () => {
    expect(parseTrustProxy("true", "production")).toBe(true);
    expect(parseTrustProxy("false", "production")).toBe(false);
    expect(parseTrustProxy("2", "development")).toBe(2);
    expect(parseTrustProxy("10.0.0.0/8, 127.0.0.1", "production")).toBe(
      "10.0.0.0/8, 127.0.0.1",
    );
  });
});
