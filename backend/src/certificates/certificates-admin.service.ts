import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { ensureMediaExists, toOptionalDate } from "../common/cms/cms.util";
import { ContentChangeService } from "../common/cms/content-change.service";
import { ErrorCode } from "../common/enums/error-code.enum";
import { PrismaService } from "../prisma/prisma.service";
import {
  AdminCertificateQueryDto,
  CreateCertificateDto,
  UpdateCertificateDto,
} from "./dto/certificate-admin.dto";

const CERTIFICATE_INCLUDE = {
  documentMedia: true,
  previewMedia: true,
} satisfies Prisma.CertificateInclude;

@Injectable()
export class CertificatesAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly changes: ContentChangeService,
  ) {}

  async list(query: AdminCertificateQueryDto) {
    return this.prisma.certificate.findMany({
      where: query.isActive === undefined ? {} : { isActive: query.isActive },
      include: CERTIFICATE_INCLUDE,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  }

  async get(id: string) {
    const cert = await this.prisma.certificate.findUnique({
      where: { id },
      include: CERTIFICATE_INCLUDE,
    });
    if (!cert) {
      throw new NotFoundException({
        code: ErrorCode.CERTIFICATE_NOT_FOUND,
        message: "Certificate not found",
      });
    }
    return cert;
  }

  /**
   * New certificates start inactive: a certificate is a public quality claim, so it
   * only goes live through `setActive(true)` once its source document is attached.
   */
  async create(dto: CreateCertificateDto, userId: string) {
    const issuedAt = toOptionalDate(dto.issuedAt) ?? null;
    const expiresAt = toOptionalDate(dto.expiresAt) ?? null;
    this.assertDateRange(issuedAt, expiresAt);
    await ensureMediaExists(this.prisma, [
      dto.documentMediaId,
      dto.previewMediaId,
    ]);

    const cert = await this.prisma.certificate.create({
      data: {
        title: dto.title,
        description: dto.description ?? null,
        documentMediaId: dto.documentMediaId ?? null,
        previewMediaId: dto.previewMediaId ?? null,
        issuedBy: dto.issuedBy ?? null,
        certificateNumber: dto.certificateNumber ?? null,
        issuedAt,
        expiresAt,
        sortOrder: dto.sortOrder ?? 0,
        isActive: false,
      },
      include: CERTIFICATE_INCLUDE,
    });

    await this.changes.record({
      userId,
      action: "certificate.create",
      entity: "Certificate",
      entityId: cert.id,
      after: cert,
    });
    return cert;
  }

  async update(id: string, dto: UpdateCertificateDto, userId: string) {
    const before = await this.get(id);
    const issuedAt = toOptionalDate(dto.issuedAt);
    const expiresAt = toOptionalDate(dto.expiresAt);
    this.assertDateRange(
      issuedAt === undefined ? before.issuedAt : issuedAt,
      expiresAt === undefined ? before.expiresAt : expiresAt,
    );
    if (before.isActive && dto.documentMediaId === null) {
      throw new BadRequestException({
        code: ErrorCode.CERTIFICATE_DOCUMENT_REQUIRED,
        message: "Deactivate the certificate before removing its document",
      });
    }
    await ensureMediaExists(this.prisma, [
      dto.documentMediaId,
      dto.previewMediaId,
    ]);

    const after = await this.prisma.certificate.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        documentMediaId: dto.documentMediaId,
        previewMediaId: dto.previewMediaId,
        issuedBy: dto.issuedBy,
        certificateNumber: dto.certificateNumber,
        issuedAt,
        expiresAt,
        sortOrder: dto.sortOrder,
      },
      include: CERTIFICATE_INCLUDE,
    });

    await this.changes.record({
      userId,
      action: "certificate.update",
      entity: "Certificate",
      entityId: id,
      before,
      after,
    });
    return after;
  }

  /** Activate (show publicly) or deactivate (archive). Certificates are never hard-deleted. */
  async setActive(id: string, isActive: boolean, userId: string) {
    const before = await this.get(id);
    if (isActive && !before.documentMediaId) {
      throw new BadRequestException({
        code: ErrorCode.CERTIFICATE_DOCUMENT_REQUIRED,
        message: "Attach the certificate document before activating it",
      });
    }

    const after = await this.prisma.certificate.update({
      where: { id },
      data: { isActive },
      include: CERTIFICATE_INCLUDE,
    });

    await this.changes.record({
      userId,
      action: isActive ? "certificate.activate" : "certificate.deactivate",
      entity: "Certificate",
      entityId: id,
      before: { isActive: before.isActive },
      after: { isActive: after.isActive },
    });
    return after;
  }

  private assertDateRange(issuedAt: Date | null, expiresAt: Date | null) {
    if (issuedAt && expiresAt && expiresAt <= issuedAt) {
      throw new BadRequestException({
        code: ErrorCode.VALIDATION_ERROR,
        message: "expiresAt must be after issuedAt",
      });
    }
  }
}
