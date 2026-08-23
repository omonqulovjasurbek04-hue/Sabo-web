import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/backend/response";
import { validateRegister } from "@/lib/backend/validation";
import { hashPassword, signJwt } from "@/lib/backend/auth";
import { db } from "@/lib/backend/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const validation = validateRegister(body);

    if (!validation.success || !validation.data) {
      return apiError("VALIDATION_ERROR", "Ma'lumotlar noto'g'ri", 422, validation.errors);
    }

    const { name, phone, email, password } = validation.data;

    const existing = db.users.findByPhone(phone);
    if (existing) {
      return apiError("ALREADY_EXISTS", "Ushbu telefon raqami allaqachon ro'yxatdan o'tgan", 409);
    }

    let passwordHash: string | undefined;
    if (password) {
      passwordHash = await hashPassword(password);
    }

    const user = db.users.create({
      name,
      phone,
      email,
      passwordHash,
      role: "user",
    });

    const token = await signJwt({
      sub: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
    });

    return apiSuccess(
      {
        user: { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role },
        token,
      },
      undefined,
      {
        status: 201,
        headers: {
          "Set-Cookie": `access_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 3600}`,
        },
      }
    );
  } catch {
    return apiError("SERVER_ERROR", "Ro'yxatdan o'tishda xatolik yuz berdi", 500);
  }
}
