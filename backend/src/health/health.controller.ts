import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Public } from "../common/guards/jwt-auth.guard";
import { RedisService } from "../common/redis/redis.service";
import { PrismaService } from "../prisma/prisma.service";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "System health check (Database, Redis, Uptime)" })
  @ApiResponse({ status: 200, description: "System health status" })
  async getHealth() {
    let dbStatus = "healthy";
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = "unreachable";
    }

    let redisStatus = "healthy";
    try {
      const ping = await this.redis.getClient()?.ping();
      if (ping !== "PONG") redisStatus = "degraded";
    } catch {
      redisStatus = "unreachable";
    }

    return {
      status: dbStatus === "healthy" ? "ok" : "error",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: "1.0.0",
      services: {
        database: dbStatus,
        redis: redisStatus,
      },
    };
  }
}
