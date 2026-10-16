import { ExecutionContext } from "@nestjs/common";
import { ThrottlerModuleOptions } from "@nestjs/throttler";
import { Request } from "express";
import { APP_CONSTANTS } from "../../config/constants";

/**
 * Paths that must never be throttled:
 *  - payment provider callbacks: Click/Payme retry from a few fixed IPs and a
 *    429 would leave a paid order unsettled;
 *  - health checks: hosting platforms poll them constantly.
 */
const EXEMPT_PATHS = [/\/payments\/[^/]+\/webhook\/?$/, /\/health\/?$/];

export function isThrottleExempt(path: string): boolean {
  const pathname = path.split("?")[0];
  return EXEMPT_PATHS.some((pattern) => pattern.test(pathname));
}

/** Stricter per-route limits, applied with `@Throttle(...)`. */
export const STRICT_LIMITS = {
  register: { default: { limit: 10, ttl: APP_CONSTANTS.RATE_LIMITS.AUTH_TTL } },
  refresh: { default: { limit: 30, ttl: APP_CONSTANTS.RATE_LIMITS.AUTH_TTL } },
  createOrder: { default: { limit: 10, ttl: 60 * 1000 } },
} as const;

export const throttlerOptions: ThrottlerModuleOptions = {
  throttlers: [
    {
      name: "default",
      ttl: APP_CONSTANTS.RATE_LIMITS.GLOBAL_TTL,
      limit: APP_CONSTANTS.RATE_LIMITS.GLOBAL_LIMIT,
    },
  ],
  skipIf: (context: ExecutionContext) =>
    isThrottleExempt(context.switchToHttp().getRequest<Request>().originalUrl ?? ""),
};

/**
 * Express `trust proxy` value. Behind Render/Railway/Caddy the socket address is
 * the proxy, so without this every client shares one IP and one rate-limit bucket.
 * TRUST_PROXY: "false" | "true" | hop count ("1") | comma-separated IPs/subnets.
 * Default: 1 hop in production, off otherwise.
 */
export function parseTrustProxy(
  raw: string | undefined,
  nodeEnv: string,
): boolean | number | string {
  if (raw === undefined || raw.trim() === "") {
    return nodeEnv === "production" ? 1 : false;
  }
  const value = raw.trim();
  if (value === "true") return true;
  if (value === "false") return false;
  if (/^\d+$/.test(value)) return Number(value);
  return value;
}
