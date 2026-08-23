import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/backend/response";
import { validateOrder } from "@/lib/backend/validation";
import { db } from "@/lib/backend/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const validation = validateOrder(body);

    if (!validation.success || !validation.data) {
      return apiError("VALIDATION_ERROR", "Buyurtma ma'lumotlari to'liq emas", 422, validation.errors);
    }

    const { items, customerName, customerPhone, address, notes, paymentMethod } = validation.data;

    let totalAmount = 0;
    const orderItems = items.map((item) => {
      const prod = db.products.findBySlug(item.productId);
      const price = prod?.price ?? 12000;
      totalAmount += price * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        volume: item.volume,
      };
    });

    const order = db.orders.create({
      customerName,
      customerPhone,
      address,
      notes,
      items: orderItems,
      totalAmount,
      paymentMethod,
    });

    let paymentUrl: string | undefined;
    if (paymentMethod === "click") {
      paymentUrl = `https://my.click.uz/services/pay?service_id=0&merchant_id=0&amount=${totalAmount}&transaction_param=${order.id}`;
    } else if (paymentMethod === "payme") {
      const b64 = Buffer.from(`m=0;ac.order_id=${order.id};a=${totalAmount * 100}`).toString("base64");
      paymentUrl = `https://checkout.paycom.uz/${b64}`;
    }

    return apiSuccess({ order, paymentUrl }, undefined, { status: 201 });
  } catch {
    return apiError("SERVER_ERROR", "Buyurtma yaratishda xatolik", 500);
  }
}
