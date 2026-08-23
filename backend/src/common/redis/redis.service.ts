import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client!: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const redisUrl = this.configService.get<string>(
      "redis.url",
      "redis://localhost:6379",
    );
    try {
      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 1,
        enableReadyCheck: false,
        lazyConnect: true,
        retryStrategy: () => null, // Do not spam reconnect if redis is offline
      });

      this.client.on("error", () => {
        // Silently handle error event to prevent Unhandled error event crash
      });

      this.client
        .connect()
        .then(() => {
          this.logger.log("✅ Redis connected successfully");
        })
        .catch(() => {
          this.logger.warn(
            `⚠️ Redis not available at ${redisUrl}. Running in in-memory fallback mode.`,
          );
        });
    } catch (e: any) {
      this.logger.warn(`⚠️ Redis initialization error: ${e.message}`);
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      if (this.client?.status === "ready") {
        return await this.client.get(key);
      }
      return null;
    } catch {
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    try {
      if (this.client?.status === "ready") {
        if (ttlSeconds) {
          await this.client.set(key, value, "EX", ttlSeconds);
        } else {
          await this.client.set(key, value);
        }
      }
    } catch (e: any) {
      this.logger.warn(`Redis set error for key ${key}: ${e.message}`);
    }
  }

  async del(key: string): Promise<void> {
    try {
      if (this.client?.status === "ready") {
        await this.client.del(key);
      }
    } catch (e: any) {
      this.logger.warn(`Redis del error for key ${key}: ${e.message}`);
    }
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      if (this.client?.status === "ready") {
        const stream = this.client.scanStream({
          match: pattern,
          count: 100,
        });

        const keysToDelete: string[] = [];
        await new Promise<void>((resolve, reject) => {
          stream.on("data", (resultKeys: string[]) => {
            keysToDelete.push(...resultKeys);
          });
          stream.on("end", () => resolve());
          stream.on("error", (err) => reject(err));
        });

        if (keysToDelete.length > 0) {
          await this.client.del(...keysToDelete);
        }
      }
    } catch (e: any) {
      this.logger.warn(
        `Redis delPattern error for pattern ${pattern}: ${e.message}`,
      );
    }
  }

  getClient(): Redis {
    return this.client;
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
      this.logger.log("Redis disconnected gracefully");
    }
  }
}
