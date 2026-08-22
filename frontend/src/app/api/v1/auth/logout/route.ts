import { apiSuccess } from "@/lib/backend/response";

export async function POST() {
  return apiSuccess(
    { message: "Tizimdan muvaffaqiyatli chiqildi" },
    undefined,
    {
      headers: {
        "Set-Cookie": "access_token=; Path=/; HttpOnly; Max-Age=0",
      },
    }
  );
}
