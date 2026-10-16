import { ConfigService } from "@nestjs/config";
import {
  OrderStatus,
  PaymentProviderType,
  PaymentStatus,
  PaymentTransactionType,
} from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

/** Minimal in-memory stand-in for the Prisma calls made by the payment providers. */

export interface FakeOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalMinor: number;
}

export interface FakePayment {
  id: string;
  orderId: string;
  provider: PaymentProviderType;
  status: PaymentStatus;
  amountMinor: number;
  externalTransactionId: string | null;
  createdAt: Date;
}

export interface FakeTransaction {
  id: string;
  paymentId: string;
  type: PaymentTransactionType;
  externalId: string | null;
  status: string;
  amountMinor: number;
  rawReference: unknown;
  createdAt: Date;
}

type Where = Record<string, unknown>;

function matches(row: object, where: Where = {}): boolean {
  const record = row as Record<string, unknown>;
  return Object.entries(where).every(([key, condition]) => {
    if (key === "payment") return true; // relation filters are resolved by the caller
    const value = record[key];
    if (condition && typeof condition === "object" && !(condition instanceof Date)) {
      const c = condition as { not?: unknown; gte?: Date; lte?: Date };
      if ("not" in c) return value !== c.not;
      if (c.gte || c.lte) {
        const time = (value as Date).getTime();
        return (!c.gte || time >= c.gte.getTime()) && (!c.lte || time <= c.lte.getTime());
      }
    }
    return value === condition;
  });
}

export const ORDER_ID = "11111111-1111-4111-8111-111111111111";

export function createFakeStore(provider: PaymentProviderType) {
  let seq = 0;
  const nextId = (prefix: string) => `${prefix}-${++seq}`;

  const orders: FakeOrder[] = [
    {
      id: ORDER_ID,
      orderNumber: "SABO-TEST-1",
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      totalMinor: 2_500_000,
    },
  ];
  const payments: FakePayment[] = [
    {
      id: "payment-1",
      orderId: ORDER_ID,
      provider,
      status: PaymentStatus.PENDING,
      amountMinor: 2_500_000,
      externalTransactionId: null,
      createdAt: new Date(),
    },
  ];
  const transactions: FakeTransaction[] = [];

  const withRelations = (tx: FakeTransaction) => {
    const payment = payments.find((p) => p.id === tx.paymentId)!;
    const order = orders.find((o) => o.id === payment.orderId)!;
    return { ...tx, payment: { ...payment, order } };
  };
  const relationMatches = (tx: FakeTransaction, where: Where) => {
    const relation = where.payment as { provider?: PaymentProviderType } | undefined;
    if (!relation?.provider) return true;
    return payments.find((p) => p.id === tx.paymentId)?.provider === relation.provider;
  };

  const client = {
    order: {
      findUnique: async ({ where }: { where: Where }) =>
        orders.find((o) => o.id === where.id) ?? null,
      update: async ({ where, data }: { where: Where; data: Partial<FakeOrder> }) => {
        const order = orders.find((o) => o.id === where.id)!;
        Object.assign(order, data);
        return order;
      },
      updateMany: async ({ where, data }: { where: Where; data: Partial<FakeOrder> }) => {
        const hits = orders.filter((o) => matches(o, where));
        hits.forEach((o) => Object.assign(o, data));
        return { count: hits.length };
      },
    },
    payment: {
      findFirst: async ({ where }: { where: Where }) =>
        payments.find((p) => matches(p, where)) ?? null,
      update: async ({ where, data }: { where: Where; data: Partial<FakePayment> }) => {
        const payment = payments.find((p) => p.id === where.id)!;
        Object.assign(payment, data);
        return payment;
      },
    },
    paymentTransaction: {
      findFirst: async ({ where, include }: { where: Where; include?: unknown }) => {
        const tx = transactions.find((t) => matches(t, where) && relationMatches(t, where));
        if (!tx) return null;
        return include ? withRelations(tx) : tx;
      },
      findMany: async ({ where }: { where: Where }) =>
        transactions
          .filter((t) => matches(t, where) && relationMatches(t, where))
          .map(withRelations),
      create: async ({ data }: { data: Omit<FakeTransaction, "id" | "createdAt" | "rawReference"> & { rawReference?: unknown } }) => {
        const row: FakeTransaction = {
          ...data,
          rawReference: data.rawReference ?? null,
          id: nextId("tx"),
          createdAt: new Date(),
        };
        transactions.push(row);
        return row;
      },
      update: async ({ where, data }: { where: Where; data: Partial<FakeTransaction> }) => {
        const tx = transactions.find((t) => t.id === where.id)!;
        Object.assign(tx, data);
        return tx;
      },
      updateMany: async ({ where, data }: { where: Where; data: Partial<FakeTransaction> }) => {
        const hits = transactions.filter((t) => matches(t, where));
        hits.forEach((t) => Object.assign(t, data));
        return { count: hits.length };
      },
    },
    $transaction: async (arg: unknown) => {
      if (Array.isArray(arg)) return Promise.all(arg);
      return (arg as (tx: unknown) => Promise<unknown>)(client);
    },
  };

  return {
    prisma: client as unknown as PrismaService,
    orders,
    payments,
    transactions,
  };
}

export function configWith(values: Record<string, string>): ConfigService {
  return {
    get: (key: string, fallback?: string) => values[key] ?? fallback,
  } as unknown as ConfigService;
}
