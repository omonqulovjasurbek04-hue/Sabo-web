import { OrderStatus, PaymentProviderType, PaymentStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { PaymentsService } from "./payments.service";
import { ClickPaymentProvider } from "./providers/click-payment.provider";
import { PaymePaymentProvider } from "./providers/payme-payment.provider";

describe("PaymentsService webhook processing", () => {
  it("does not mark an order as paid when the provider amount differs", async () => {
    const transaction = {
      order: {
        findUnique: jest.fn().mockResolvedValue({
          id: "order-1",
          orderNumber: "SABO-1",
          totalMinor: 25_000,
          paymentStatus: PaymentStatus.PENDING,
          status: OrderStatus.PENDING,
        }),
        update: jest.fn(),
      },
      payment: {
        findFirst: jest.fn().mockResolvedValue({ id: "payment-1" }),
        updateMany: jest.fn(),
      },
    };
    const prisma = {
      $transaction: jest.fn(async (callback: (tx: typeof transaction) => unknown) =>
        callback(transaction),
      ),
    } as unknown as PrismaService;
    const clickProvider = {
      handleWebhook: jest.fn().mockResolvedValue({
        isSuccess: true,
        orderId: "order-1",
        amountMinor: 24_999,
        externalTransactionId: "click-transaction-1",
        responsePayload: { error: 0 },
      }),
    } as unknown as ClickPaymentProvider;
    const paymeProvider = {} as PaymePaymentProvider;
    const service = new PaymentsService(prisma, clickProvider, paymeProvider);

    await service.processWebhook("click", {}, {});

    expect(transaction.payment.findFirst).toHaveBeenCalledWith({
      where: { orderId: "order-1", provider: PaymentProviderType.CLICK },
    });
    expect(transaction.order.update).not.toHaveBeenCalled();
    expect(transaction.payment.updateMany).not.toHaveBeenCalled();
  });
});
