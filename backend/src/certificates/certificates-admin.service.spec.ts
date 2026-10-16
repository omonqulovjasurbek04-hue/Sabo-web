import { BadRequestException, NotFoundException } from "@nestjs/common";
import { ContentChangeService } from "../common/cms/content-change.service";
import { ErrorCode } from "../common/enums/error-code.enum";
import { PrismaService } from "../prisma/prisma.service";
import { CertificatesAdminService } from "./certificates-admin.service";

const USER_ID = "user-1";
const DOC_ID = "22222222-2222-4222-8222-222222222222";

function makeCert(overrides: Record<string, unknown> = {}) {
  return {
    id: "cert-1",
    title: "ISO 22000",
    documentMediaId: null as string | null,
    issuedAt: null as Date | null,
    expiresAt: null as Date | null,
    isActive: false,
    ...overrides,
  };
}

function setup() {
  const prisma = {
    certificate: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    media: { count: jest.fn().mockResolvedValue(1) },
  };
  const changes = { record: jest.fn() };
  const service = new CertificatesAdminService(
    prisma as unknown as PrismaService,
    changes as unknown as ContentChangeService,
  );
  return { prisma, changes, service };
}

describe("CertificatesAdminService", () => {
  it("always creates certificates inactive and audits the creation", async () => {
    const { prisma, changes, service } = setup();
    prisma.certificate.create.mockResolvedValue(makeCert());

    await service.create(
      {
        title: "ISO 22000",
        documentMediaId: DOC_ID,
        issuedAt: "2025-01-01T00:00:00.000Z",
      },
      USER_ID,
    );

    const { data } = prisma.certificate.create.mock.calls[0][0];
    expect(data.isActive).toBe(false);
    expect(data.issuedAt).toEqual(new Date("2025-01-01T00:00:00.000Z"));
    expect(changes.record).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "certificate.create",
        entity: "Certificate",
      }),
    );
  });

  it("rejects an expiry date that is not after the issue date", async () => {
    const { prisma, service } = setup();

    await expect(
      service.create(
        {
          title: "ISO",
          issuedAt: "2025-06-01T00:00:00.000Z",
          expiresAt: "2025-01-01T00:00:00.000Z",
        },
        USER_ID,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.certificate.create).not.toHaveBeenCalled();
  });

  it("rejects document media that does not exist", async () => {
    const { prisma, service } = setup();
    prisma.media.count.mockResolvedValue(0);

    await expect(
      service.create({ title: "ISO", documentMediaId: DOC_ID }, USER_ID),
    ).rejects.toMatchObject({
      response: { code: ErrorCode.MEDIA_NOT_FOUND },
    });
  });

  it("will not activate a certificate without its source document", async () => {
    const { prisma, changes, service } = setup();
    prisma.certificate.findUnique.mockResolvedValue(makeCert());

    await expect(
      service.setActive("cert-1", true, USER_ID),
    ).rejects.toMatchObject({
      response: { code: ErrorCode.CERTIFICATE_DOCUMENT_REQUIRED },
    });
    expect(prisma.certificate.update).not.toHaveBeenCalled();
    expect(changes.record).not.toHaveBeenCalled();
  });

  it("activates a documented certificate and audits the flag change", async () => {
    const { prisma, changes, service } = setup();
    prisma.certificate.findUnique.mockResolvedValue(
      makeCert({ documentMediaId: DOC_ID }),
    );
    prisma.certificate.update.mockResolvedValue(
      makeCert({ documentMediaId: DOC_ID, isActive: true }),
    );

    await service.setActive("cert-1", true, USER_ID);

    expect(prisma.certificate.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { isActive: true } }),
    );
    expect(changes.record).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "certificate.activate",
        before: { isActive: false },
        after: { isActive: true },
      }),
    );
  });

  it("deactivates (archives) instead of deleting", async () => {
    const { prisma, changes, service } = setup();
    prisma.certificate.findUnique.mockResolvedValue(
      makeCert({ isActive: true, documentMediaId: DOC_ID }),
    );
    prisma.certificate.update.mockResolvedValue(makeCert({ isActive: false }));

    await service.setActive("cert-1", false, USER_ID);

    expect(changes.record).toHaveBeenCalledWith(
      expect.objectContaining({ action: "certificate.deactivate" }),
    );
  });

  it("blocks removing the document from an active certificate", async () => {
    const { prisma, service } = setup();
    prisma.certificate.findUnique.mockResolvedValue(
      makeCert({ isActive: true, documentMediaId: DOC_ID }),
    );

    await expect(
      service.update("cert-1", { documentMediaId: null }, USER_ID),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.certificate.update).not.toHaveBeenCalled();
  });

  it("validates the date range against stored values on partial update", async () => {
    const { prisma, service } = setup();
    prisma.certificate.findUnique.mockResolvedValue(
      makeCert({ issuedAt: new Date("2025-06-01T00:00:00.000Z") }),
    );

    await expect(
      service.update(
        "cert-1",
        { expiresAt: "2025-01-01T00:00:00.000Z" },
        USER_ID,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("404s for an unknown certificate", async () => {
    const { prisma, service } = setup();
    prisma.certificate.findUnique.mockResolvedValue(null);

    await expect(service.get("missing")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
