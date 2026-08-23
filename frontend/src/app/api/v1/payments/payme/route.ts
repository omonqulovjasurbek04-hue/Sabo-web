import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/backend/response";
import { db } from "@/lib/backend/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { method, params, id } = body;

    if (method === "CheckPerformTransaction") {
      const order = db.orders.findById(params.account.order_id);
      if (!order) {
        return apiError("ORDER_NOT_FOUND", "Buyurtma topilmadi", 404);
      }
      return apiSuccess({
        result: { allow: true },
        id,
      });
    }

    if (method === "PerformTransaction") {
      const order = db.orders.findById(params.account?.order_id);
      if (order) {
        db.orders.updatePaymentStatus(order.id, "paid");
      }
      return apiSuccess({
        result: {
          transaction: params.id,
          perform_time: Date.now(),
          state: 2,
        },
        id,
      });
    }

    return apiSuccess({ result: { success: true }, id });
  } catch {
    return apiError("SERVER_ERROR", "Payme xatolik", 500);
  }
}
