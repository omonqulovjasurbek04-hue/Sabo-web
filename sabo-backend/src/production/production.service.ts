import { Injectable, NotFoundException } from '@nestjs/common';
import { ErrorCode } from '../common/enums/error-code.enum';
import { pickTranslation } from '../common/utils/localization.util';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductionService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicProductionPage(locale = 'uz') {
    const page = await this.prisma.productionPage.findFirst({
      where: { status: 'PUBLISHED' },
      include: {
        translations: true,
        heroImage: true,
        steps: {
          include: { image: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!page) {
      return null;
    }

    const trans = pickTranslation(page.translations, locale);
    return {
      id: page.id,
      heroTitle: trans?.title || page.heroTitle,
      heroDescription: trans?.description || page.heroDescription,
      heroImage: page.heroImage ? { id: page.heroImage.id, url: page.heroImage.url } : null,
      steps: page.steps.map((step) => ({
        id: step.id,
        sortOrder: step.sortOrder,
        title: step.title,
        description: step.description,
        image: step.image ? { id: step.image.id, url: step.image.url } : null,
      })),
    };
  }
}
