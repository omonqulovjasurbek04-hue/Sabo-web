import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/backend/response";
import { db } from "@/lib/backend/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = db.products.findBySlug(slug);

  if (!product) {
    return apiError("NOT_FOUND", "Mahsulot topilmadi", 404);
  }

  return apiSuccess(product);
}
