import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/backend/response";
import { db } from "@/lib/backend/db";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = (await req.json()) as Partial<Product>;
    const updated = db.products.update(slug, body);

    if (!updated) {
      return apiError("NOT_FOUND", "Tahrirlanuvchi mahsulot topilmadi", 404);
    }

    return apiSuccess(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Mahsulotni tahrirlashda xatolik";
    return apiError("PRODUCT_UPDATE_ERROR", message, 500);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const deleted = db.products.delete(slug);

    if (!deleted) {
      return apiError("NOT_FOUND", "O'chiriluvchi mahsulot topilmadi", 404);
    }

    return apiSuccess({ deleted: true, slug });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Mahsulotni o'chirishda xatolik";
    return apiError("PRODUCT_DELETE_ERROR", message, 500);
  }
}
