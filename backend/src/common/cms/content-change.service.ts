import { Injectable } from "@nestjs/common";
import { AuditEntry, AuditService } from "../audit/audit.service";
import { RedisService } from "../redis/redis.service";
import { HOME_CACHE_PATTERN } from "./cms.util";

/**
 * Single post-write hook for every CMS admin mutation: records an AuditLog row
 * and drops the cached public homepage (`HomeService` caches `home:<locale>`),
 * which aggregates hero, production, about, certificates and blog content.
 */
@Injectable()
export class ContentChangeService {
  constructor(
    private readonly audit: AuditService,
    private readonly redis: RedisService,
  ) {}

  async record(entry: AuditEntry): Promise<void> {
    await this.audit.log(entry);
    await this.redis.delPattern(HOME_CACHE_PATTERN);
  }
}
