import { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/backend/response";
import { db } from "@/lib/backend/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("q") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  const result = db.products.findMany({ category, search, page, limit });
  return apiSuccess(result.data, {
    page: result.page,
    limit: result.limit,
    total: result.total,
    totalPages: result.totalPages,
  });
}
