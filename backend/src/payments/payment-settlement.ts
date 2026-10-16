import { OrderStatus, PaymentStatus, Prisma } from "@prisma/client";

/**
 * Marks an order and its payment as PAID inside the caller's transaction.
 *
 * The order update is conditional on the order not already being PAID, so two
 * concurrent provider callbacks can never both "win": the loser sees
 * `count === 0` and must treat the callback as an idempotent replay.
 */
export async function settleOrderPayment(
  tx: Prisma.TransactionClient,
  args: { orderId: string; paymentId: string; externalTransactionId: string },
): Promise<boolean> {
  const updated = await tx.order.updateMany({
    where: {
      id: args.orderId,
      paymentStatus: { not: PaymentStatus.PAID },
      status: { not: OrderStatus.CANCELLED },
    },
    data: { paymentStatus: PaymentStatus.PAID },
  });
  if (updated.count === 0) return false;

  await tx.order.updateMany({
    where: { id: args.orderId, status: OrderStatus.PENDING },
    data: { status: OrderStatus.CONFIRMED },
  });

  await tx.payment.update({
    where: { id: args.paymentId },
    data: {
      status: PaymentStatus.PAID,
      externalTransactionId: args.externalTransactionId,
    },
  });
  return true;
}
