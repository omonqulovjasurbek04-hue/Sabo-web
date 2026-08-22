import { apiSuccess } from "@/lib/backend/response";

export async function GET() {
  return apiSuccess({
    status: "ok",
    service: "SABO Web API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
}
