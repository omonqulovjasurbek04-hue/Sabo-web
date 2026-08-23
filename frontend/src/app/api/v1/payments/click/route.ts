import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/backend/response";
import { db } from "@/lib/backend/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { click_trans_id, merchant_trans_id, action, error } = body;

    if (error && error < 0) {
      return apiError("CLICK_ERROR", "Click to'lov xatosi", 400);
    }

    const order = db.orders.findById(merchant_trans_id);
    if (!order) {
      return apiError("ORDER_NOT_FOUND", "Buyurtma topilmadi", 404);
    }

    if (action === 0) {
      return apiSuccess({
        click_trans_id,
        merchant_trans_id,
        merchant_prepare_id: order.id,
        error: 0,
        error_note: "Success",
      });
    }

    if (action === 1) {
      db.orders.updatePaymentStatus(order.id, "paid");
      return apiSuccess({
        click_trans_id,
        merchant_trans_id,
        merchant_confirm_id: order.id,
        error: 0,
        error_note: "Success",
      });
    }

    return apiError("INVALID_ACTION", "Noto'g'ri action", 400);
  } catch {
    return apiError("SERVER_ERROR", "To'lovni qayta ishlashda xatolik", 500);
  }
}
