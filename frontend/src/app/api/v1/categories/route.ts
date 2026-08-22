import { apiSuccess } from "@/lib/backend/response";
import { db } from "@/lib/backend/db";

export async function GET() {
  const categories = db.categories.findMany();
  return apiSuccess(categories);
}
