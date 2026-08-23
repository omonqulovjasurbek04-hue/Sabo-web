import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const fileQuery = searchParams.get("file");

  const publicDir = path.join(process.cwd(), "public");

  // Search candidate paths
  let resolvedPath: string | null = null;
  let fileName = "sabo-file";

  if (fileQuery) {
    const candidate = path.join(publicDir, fileQuery.replace(/^\//, ""));
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      resolvedPath = candidate;
      fileName = path.basename(candidate);
    }
  }

  if (!resolvedPath) {
    // Check uploads directory for filename or ID match
    const uploadsDir = path.join(publicDir, "uploads");
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      for (const f of files) {
        if (f.includes(id) || Buffer.from(f).toString("hex").substring(0, 12) === id) {
          resolvedPath = path.join(uploadsDir, f);
          fileName = f;
          break;
        }
      }
    }
  }

  if (!resolvedPath) {
    // Check products directory
    const prodDir = path.join(publicDir, "images", "products");
    if (fs.existsSync(prodDir)) {
      const files = fs.readdirSync(prodDir);
      for (const f of files) {
        if (f.includes(id) || Buffer.from(f).toString("hex").substring(0, 12) === id) {
          resolvedPath = path.join(prodDir, f);
          fileName = f;
          break;
        }
      }
    }
  }

  if (!resolvedPath || !fs.existsSync(resolvedPath)) {
    return new NextResponse("Fayl topilmadi", { status: 404 });
  }

  const fileBuffer = fs.readFileSync(resolvedPath);
  const ext = path.extname(fileName).toLowerCase();
  let contentType = "application/octet-stream";
  if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
  else if (ext === ".png") contentType = "image/png";
  else if (ext === ".pdf") contentType = "application/pdf";
  else if (ext === ".svg") contentType = "image/svg+xml";

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
      "Content-Length": fileBuffer.length.toString(),
    },
  });
}
