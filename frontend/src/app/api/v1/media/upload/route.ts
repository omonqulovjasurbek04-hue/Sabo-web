import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/backend/response";
import type { MediaFileItem } from "@/lib/types";
import * as fs from "fs";
import * as path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";
    const altText = (formData.get("altText") as string) || "";

    if (!file) {
      return apiError("FILE_REQUIRED", "Fayl yuklanmadi", 400);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save destination in public/uploads or public/images/[folder]
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const ext = path.extname(file.name).toLowerCase();
    const sanitizedBase = path
      .basename(file.name, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueFileName = `${sanitizedBase}_${Date.now()}${ext}`;
    const filePath = path.join(uploadsDir, uniqueFileName);

    fs.writeFileSync(filePath, buffer);

    const relativeUrl = `/uploads/${uniqueFileName}`;
    const mediaItem: MediaFileItem = {
      id: `med_${Date.now()}`,
      fileName: uniqueFileName,
      originalName: file.name,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      url: relativeUrl,
      folder: (folder as MediaFileItem["folder"]) || "general",
      altText: altText || file.name,
      createdAt: new Date().toISOString(),
    };

    return apiSuccess(mediaItem, undefined, { status: 201 });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    const message = error instanceof Error ? error.message : "Fayl yuklashda xatolik yuz berdi";
    return apiError("UPLOAD_FAILED", message, 500);
  }
}
