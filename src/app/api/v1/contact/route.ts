import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/backend/response";
import { validateContact } from "@/lib/backend/validation";
import { checkRateLimit } from "@/lib/backend/rate-limit";
import { db } from "@/lib/backend/db";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const rate = checkRateLimit(`contact_${ip}`, 5, 60 * 1000);

  if (!rate.allowed) {
    return apiError("RATE_LIMITED", "Iltimos bir oz kuting va qayta urinib ko'ring", 429);
  }

  try {
    const body = await req.json();
    const validation = validateContact(body);

    if (!validation.success || !validation.data) {
      return apiError("VALIDATION_ERROR", "Ma'lumotlar noto'g'ri", 422, validation.errors);
    }

    const record = db.contact.create(validation.data);

    return apiSuccess({
      id: record.id,
      message: "Xabaringiz muvaffaqiyatli qabul qilindi. Tez orada siz bilan bog'lanamiz!",
    }, undefined, { status: 201 });
  } catch (err: unknown) {
    return apiError("SERVER_ERROR", "Serverda xatolik yuz berdi", 500);
  }
}
