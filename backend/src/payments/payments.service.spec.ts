import { NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { PaymentsService } from "./payments.service";
import { ClickPaymentProvider } from "./providers/click-payment.provider";
import { PaymePaymentProvider } from "./providers/payme-payment.provider";

describe("PaymentsService webhook dispatch", () => {
  const clickReply = { error: 0 };
  const paymeReply = { result: { allow: true }, id: 1 };
  const clickProvider = {
    handleWebhook: jest.fn().mockResolvedValue(clickReply),
  } as unknown as ClickPaymentProvider;
  const paymeProvider = {
    handleWebhook: jest.fn().mockResolvedValue(paymeReply),
  } as unknown as PaymePaymentProvider;
  const service = new PaymentsService(
    {} as PrismaService,
    clickProvider,
    paymeProvider,
  );

  it("returns the provider's protocol response verbatim", async () => {
    await expect(service.processWebhook("CLICK", {}, {})).resolves.toBe(clickReply);
    await expect(service.processWebhook("payme", {}, {})).resolves.toBe(paymeReply);
  });

  it("rejects unknown providers", async () => {
    await expect(service.processWebhook("stripe", {}, {})).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
