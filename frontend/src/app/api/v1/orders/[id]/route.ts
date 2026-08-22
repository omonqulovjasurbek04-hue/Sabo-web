import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/backend/response";
import { db } from "@/lib/backend/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = db.orders.findById(id);

  if (!order) {
    return apiError("NOT_FOUND", "Buyurtma topilmadi", 404);
  }

  return apiSuccess(order);
}
