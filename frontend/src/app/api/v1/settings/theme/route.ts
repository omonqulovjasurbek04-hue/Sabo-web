import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/backend/response";
import { db } from "@/lib/backend/db";
import type { ThemeSettings } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const theme = db.settings.getTheme();
    return apiSuccess(theme);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Mavzu sozlamalarini olishda xatolik";
    return apiError("THEME_FETCH_ERROR", message, 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<ThemeSettings>;
    const updated = db.settings.updateTheme(body);
    return apiSuccess(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Mavzu sozlamalarini saqlashda xatolik";
    return apiError("THEME_UPDATE_ERROR", message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    if (action === "reset") {
      const resetTheme = db.settings.resetTheme();
      return apiSuccess(resetTheme);
    }
    const body = (await req.json().catch(() => ({}))) as { reset?: boolean };
    if (body.reset) {
      const resetTheme = db.settings.resetTheme();
      return apiSuccess(resetTheme);
    }
    const theme = db.settings.getTheme();
    return apiSuccess(theme);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Mavzu sozlamalarini tiklashda xatolik";
    return apiError("THEME_RESET_ERROR", message, 500);
  }
}
