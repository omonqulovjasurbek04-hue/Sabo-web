import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/backend/response";
import { validateLogin } from "@/lib/backend/validation";
import { verifyPassword, signJwt } from "@/lib/backend/auth";
import { db } from "@/lib/backend/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const validation = validateLogin(body);

    if (!validation.success || !validation.data) {
      return apiError("VALIDATION_ERROR", "Telefon yoki parol noto'g'ri", 422, validation.errors);
    }

    const { identifier, phone, email, password } = validation.data;
    const lookupKey = identifier || phone || email || "";
    const user = db.users.findByIdentifier(lookupKey);

    if (!user) {
      return apiError("INVALID_CREDENTIALS", "Foydalanuvchi topilmadi", 401);
    }

    if (user.passwordHash && password) {
      const isValid = await verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return apiError("INVALID_CREDENTIALS", "Parol noto'g'ri", 401);
      }
    } else if (password) {
      // Default admin password verification (supports admin123, admin, sabo2026 for admin role)
      if (user.role === "admin" && !["admin123", "admin", "sabo2026", "admin@sabo"].includes(password)) {
        return apiError("INVALID_CREDENTIALS", "Parol noto'g'ri", 401);
      }
    }

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
        headers: {
          "Set-Cookie": `access_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 3600}`,
        },
      }
    );
  } catch {
    return apiError("SERVER_ERROR", "Tizimga kirishda xatolik", 500);
  }
}
