import { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/backend/response";
import type { MediaFileItem } from "@/lib/types";
import * as fs from "fs";
import * as path from "path";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const folder = searchParams.get("folder") || "all";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  const mediaList: MediaFileItem[] = [];

  // 1. Gather all default public images
  const publicDir = path.join(process.cwd(), "public");
  const foldersToScan = [
    { dir: path.join(publicDir, "images", "products"), folder: "products" as const },
    { dir: path.join(publicDir, "images", "nature"), folder: "nature" as const },
    { dir: path.join(publicDir, "images", "gallery"), folder: "gallery" as const },
    { dir: path.join(publicDir, "uploads"), folder: "general" as const },
  ];

  foldersToScan.forEach(({ dir, folder: fName }) => {
    if (fs.existsSync(dir)) {
      try {
        const files = fs.readdirSync(dir);
        files.forEach((file) => {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          if (stat.isFile() && !file.includes("copy")) {
            const ext = path.extname(file).toLowerCase();
            let mimeType = "image/jpeg";
            if (ext === ".png") mimeType = "image/png";
            else if (ext === ".svg") mimeType = "image/svg+xml";
            else if (ext === ".webp") mimeType = "image/webp";
            else if (ext === ".pdf") mimeType = "application/pdf";
            else if (ext === ".glb" || ext === ".gltf") mimeType = "model/gltf-binary";

            const relativeUrl = fName === "general"
              ? `/uploads/${file}`
              : `/images/${fName}/${file}`;

            mediaList.push({
              id: `med_${Buffer.from(file).toString("hex").substring(0, 12)}`,
              fileName: file,
              originalName: file,
              mimeType,
              size: stat.size,
              url: relativeUrl,
              folder: fName,
              altText: file.replace(/[-_.]/g, " "),
              createdAt: stat.birthtime.toISOString(),
            });
          }
        });
      } catch (err) {
        console.error("Error reading dir:", dir, err);
      }
    }
  });

  // Filter by folder if requested
  const filtered = folder && folder !== "all"
    ? mediaList.filter((m) => m.folder === folder)
    : mediaList;

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const data = filtered.slice((page - 1) * limit, page * limit);

  return apiSuccess(data, {
    page,
    limit,
    total,
    totalPages,
  });
}
