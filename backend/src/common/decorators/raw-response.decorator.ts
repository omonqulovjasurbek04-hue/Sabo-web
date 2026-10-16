import { SetMetadata } from "@nestjs/common";

export const RAW_RESPONSE_KEY = "rawResponse";

/**
 * Skips the global `{ success, data }` envelope. Required for endpoints whose
 * response format is dictated by a third party (e.g. Click / Payme webhooks).
 */
export const RawResponse = () => SetMetadata(RAW_RESPONSE_KEY, true);
