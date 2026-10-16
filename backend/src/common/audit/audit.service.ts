import { Injectable, Logger } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

export interface AuditEntry {
  userId?: string | null;
  /** Dot-separated verb, e.g. `blog_post.publish` */
  action: string;
  /** Prisma model name, e.g. `BlogPost` */
  entity: string;
  entityId?: string | null;
  before?: unknown;
  after?: unknown;
}

/**
 * Serialises arbitrary data (Dates, nested Prisma records) into a JSON value
 * that Prisma accepts for `Json` columns. `undefined`/`null` leave the column empty.
 */
export function toAuditJson(value: unknown): Prisma.InputJsonValue | undefined {
  if (value === undefined || value === null) return undefined;
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Writes an audit trail row. A failed audit write is logged loudly but does not
   * roll back the business write that already succeeded.
   */
  async log(entry: AuditEntry): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: entry.userId ?? null,
          action: entry.action,
          entity: entry.entity,
          entityId: entry.entityId ?? null,
          before: toAuditJson(entry.before),
          after: toAuditJson(entry.after),
        },
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      this.logger.error(
        `Audit log write failed (${entry.action} ${entry.entity}:${entry.entityId ?? "-"}): ${message}`,
      );
    }
  }
}
