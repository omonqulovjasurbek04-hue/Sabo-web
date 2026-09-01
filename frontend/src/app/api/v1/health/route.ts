import { NextResponse } from "next/server";

// Minimal, dependency-free healthcheck for Railway's frontend service —
// intentionally does not call the backend or any external service.
export function GET() {
  return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() });
}
