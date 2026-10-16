import { PrismaService } from "../../prisma/prisma.service";
import { AuditService, toAuditJson } from "../audit/audit.service";
import { RedisService } from "../redis/redis.service";
import { ContentChangeService } from "./content-change.service";
import { HOME_CACHE_PATTERN } from "./cms.util";

describe("ContentChangeService", () => {
  it("writes the audit row and drops the cached homepage", async () => {
    const audit = { log: jest.fn() };
    const redis = { delPattern: jest.fn() };
    const service = new ContentChangeService(
      audit as unknown as AuditService,
      redis as unknown as RedisService,
    );
    const entry = {
      userId: "user-1",
      action: "blog_post.publish",
      entity: "BlogPost",
      entityId: "post-1",
    };

    await service.record(entry);

    expect(audit.log).toHaveBeenCalledWith(entry);
    expect(redis.delPattern).toHaveBeenCalledWith(HOME_CACHE_PATTERN);
  });
});

describe("AuditService", () => {
  it("serialises before/after snapshots into JSON", async () => {
    const create = jest.fn();
    const service = new AuditService({
      auditLog: { create },
    } as unknown as PrismaService);
    const at = new Date("2026-10-16T00:00:00.000Z");

    await service.log({
      userId: "user-1",
      action: "certificate.update",
      entity: "Certificate",
      entityId: "cert-1",
      before: { issuedAt: at },
      after: { issuedAt: null },
    });

    expect(create).toHaveBeenCalledWith({
      data: {
        userId: "user-1",
        action: "certificate.update",
        entity: "Certificate",
        entityId: "cert-1",
        before: { issuedAt: "2026-10-16T00:00:00.000Z" },
        after: { issuedAt: null },
      },
    });
  });

  it("does not throw when the audit insert fails", async () => {
    const service = new AuditService({
      auditLog: { create: jest.fn().mockRejectedValue(new Error("db down")) },
    } as unknown as PrismaService);
    jest.spyOn(service["logger"], "error").mockImplementation(() => undefined);

    await expect(
      service.log({ action: "x", entity: "Y" }),
    ).resolves.toBeUndefined();
  });

  it("leaves empty snapshots unset", () => {
    expect(toAuditJson(undefined)).toBeUndefined();
    expect(toAuditJson(null)).toBeUndefined();
  });
});
