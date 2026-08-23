import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/backend/response";
import { db } from "@/lib/backend/db";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("q") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  const result = db.products.findMany({ category, search, page, limit });
  return apiSuccess(result.data, {
    page: result.page,
    limit: result.limit,
    total: result.total,
    totalPages: result.totalPages,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<Product>;
    if (!body.name?.uz || !body.category) {
      return apiError("VALIDATION_ERROR", "Mahsulot nomi va toifasi majburiy", 400);
    }

    const slug = body.slug || `sabo-${body.name.uz.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now()}`;
    const newProduct: Product = {
      id: body.id || `prod_${Date.now()}`,
      slug,
      name: body.name,
      description: body.description || { uz: "", ru: "", en: "" },
      category: body.category,
      image: body.image || "/images/products/Sabo_Milk.jpg",
      galleryImages: body.galleryImages || [body.image || "/images/products/Sabo_Milk.jpg"],
      volumes: body.volumes || ["1 L"],
      fat: body.fat || "3.2%",
      price: body.price ?? 13000,
      availability: body.availability || "in-stock",
      isPlaceholder: false,
      colorAccent: body.colorAccent || "#2F6B45",
      colorTheme: body.colorTheme || "green",
      badges: body.badges || [{ uz: "100% Tabiiy", ru: "100% Натуральное", en: "100% Natural" }],
      nutrition: body.nutrition,
      storage: body.storage,
      addOns: body.addOns,
    };

    const created = db.products.create(newProduct);
    return apiSuccess(created, undefined, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Mahsulot yaratishda xatolik";
    return apiError("PRODUCT_CREATE_ERROR", message, 500);
  }
}
