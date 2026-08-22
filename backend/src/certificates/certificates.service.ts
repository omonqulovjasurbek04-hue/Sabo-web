import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CertificatesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPublic() {
    const certificates = await this.prisma.certificate.findMany({
      where: { isActive: true },
      include: {
        documentMedia: true,
        previewMedia: true,
      },
      orderBy: { sortOrder: 'asc' },
    });

    return certificates.map((cert) => ({
      id: cert.id,
      title: cert.title,
      description: cert.description,
      issuedBy: cert.issuedBy,
      certificateNumber: cert.certificateNumber,
      issuedAt: cert.issuedAt,
      expiresAt: cert.expiresAt,
      documentUrl: cert.documentMedia?.url || null,
      previewUrl: cert.previewMedia?.url || null,
    }));
  }

  async findOne(id: string) {
    const cert = await this.prisma.certificate.findUnique({
      where: { id },
      include: { documentMedia: true, previewMedia: true },
    });

    if (!cert || !cert.isActive) {
      throw new NotFoundException('Certificate not found');
    }

    return {
      id: cert.id,
      title: cert.title,
      description: cert.description,
      issuedBy: cert.issuedBy,
      certificateNumber: cert.certificateNumber,
      issuedAt: cert.issuedAt,
      expiresAt: cert.expiresAt,
      documentUrl: cert.documentMedia?.url || null,
      previewUrl: cert.previewMedia?.url || null,
    };
  }
}
