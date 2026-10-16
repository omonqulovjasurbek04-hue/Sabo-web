/**
 * Detects the real type of an uploaded file from its content (magic bytes).
 * The client-supplied MIME type and file name are not trusted: the stored
 * extension and Content-Type come from what is detected here.
 */
export type MediaKind = "image" | "document" | "model";

export interface DetectedFileType {
  mime: string;
  ext: string;
  kind: MediaKind;
}

function startsWith(buf: Buffer, bytes: number[], offset = 0): boolean {
  if (buf.length < offset + bytes.length) return false;
  return bytes.every((byte, i) => buf[offset + i] === byte);
}

function ascii(buf: Buffer, start: number, end: number): string {
  return buf.length < end ? "" : buf.toString("latin1", start, end);
}

/** glTF JSON: a JSON object with an `asset.version` field (glTF 2.0 spec). */
function isGltfJson(buf: Buffer): boolean {
  // trimStart() also strips a UTF-8 BOM (U+FEFF counts as whitespace in JS).
  const text = buf.toString("utf8").trimStart();
  if (!text.startsWith("{")) return false;
  try {
    const parsed: unknown = JSON.parse(text);
    if (typeof parsed !== "object" || parsed === null) return false;
    const asset = (parsed as { asset?: unknown }).asset;
    return (
      typeof asset === "object" &&
      asset !== null &&
      typeof (asset as { version?: unknown }).version === "string"
    );
  } catch {
    return false;
  }
}

export function detectFileType(buf: Buffer | undefined): DetectedFileType | null {
  if (!buf || buf.length < 4) return null;

  if (startsWith(buf, [0xff, 0xd8, 0xff])) {
    return { mime: "image/jpeg", ext: ".jpg", kind: "image" };
  }
  if (startsWith(buf, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { mime: "image/png", ext: ".png", kind: "image" };
  }
  if (ascii(buf, 0, 4) === "RIFF" && ascii(buf, 8, 12) === "WEBP") {
    return { mime: "image/webp", ext: ".webp", kind: "image" };
  }
  if (ascii(buf, 4, 8) === "ftyp" && ["avif", "avis"].includes(ascii(buf, 8, 12))) {
    return { mime: "image/avif", ext: ".avif", kind: "image" };
  }
  if (ascii(buf, 0, 5) === "%PDF-") {
    return { mime: "application/pdf", ext: ".pdf", kind: "document" };
  }
  if (ascii(buf, 0, 4) === "glTF") {
    return { mime: "model/gltf-binary", ext: ".glb", kind: "model" };
  }
  if (isGltfJson(buf)) {
    return { mime: "model/gltf+json", ext: ".gltf", kind: "model" };
  }
  return null;
}

/**
 * Whether the MIME type the client declared is consistent with the content.
 * Browsers often send `application/octet-stream` for .glb files, so that is
 * accepted for binary glTF only.
 */
export function declaredMimeMatches(declared: string, detected: DetectedFileType): boolean {
  if (declared === detected.mime) return true;
  if (declared === "image/jpg" && detected.mime === "image/jpeg") return true;
  return declared === "application/octet-stream" && detected.mime === "model/gltf-binary";
}
