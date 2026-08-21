import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client!: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const redisUrl = this.configService.get<string>('redis.url', 'redis://localhost:6379');
    try {
      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        lazyConnect: true,
      });

      this.client.connect().then(() => {
        this.logger.log('✅ Redis connected successfully');
      }).catch((err) => {
        this.logger.warn(`⚠️ Redis connection failed: ${err.message}. Running in fallback mode.`);
      });
    } catch (e: any) {
      this.logger.warn(`⚠️ Redis initialization error: ${e.message}`);
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      if (this.client?.status === 'ready') {
        return await this.client.get(key);
      }
      return null;
    } catch {
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    try {
      if (this.client?.status === 'ready') {
        if (ttlSeconds) {
          await this.client.set(key, value, 'EX', ttlSeconds);
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
      if (this.client?.status === 'ready') {
        await this.client.del(key);
      }
    } catch (e: any) {
      this.logger.warn(`Redis del error for key ${key}: ${e.message}`);
    }
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      if (this.client?.status === 'ready') {
        const keys = await this.client.keys(pattern);
        if (keys.length > 0) {
          await this.client.del(...keys);
        }
      }
    } catch (e: any) {
      this.logger.warn(`Redis delPattern error for pattern ${pattern}: ${e.message}`);
    }
  }

  getClient(): Redis {
    return this.client;
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
      this.logger.log('Redis disconnected gracefully');
    }
  }
}
