import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/backend/response";
import { verifyJwt } from "@/lib/backend/auth";
import { db } from "@/lib/backend/db";

export async function GET(req: NextRequest) {
  let token = req.cookies.get("access_token")?.value;
  if (!token) {
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    return apiError("UNAUTHORIZED", "Avtorizatsiyadan o'tilmagan", 401);
  }

  const payload = await verifyJwt(token);
  if (!payload) {
    return apiError("UNAUTHORIZED", "Token yaroqsiz yoki muddati o'tgan", 401);
  }

  const user = db.users.findById(payload.sub);
  if (!user) {
    return apiError("NOT_FOUND", "Foydalanuvchi topilmadi", 404);
  }

  return apiSuccess({
    id: user.id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    role: user.role,
  });
}
