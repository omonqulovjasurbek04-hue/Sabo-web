import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { UpsertCmsPageDto } from "../common/cms/cms-page.dto";
import {
  assertCompleteLocales,
  assertUniqueLocales,
  ensureMediaExists,
  PAGE_STATUS,
} from "../common/cms/cms.util";
import { ContentChangeService } from "../common/cms/content-change.service";
import { ErrorCode } from "../common/enums/error-code.enum";
import { PrismaService } from "../prisma/prisma.service";
import {
  CreateProductionStepDto,
  UpdateProductionStepDto,
} from "./dto/production-admin.dto";

const PAGE_INCLUDE = {
  translations: { orderBy: { locale: "asc" } },
  heroImage: true,
  steps: { include: { image: true }, orderBy: { sortOrder: "asc" } },
} satisfies Prisma.ProductionPageInclude;

type PageStatus = (typeof PAGE_STATUS)[keyof typeof PAGE_STATUS];

@Injectable()
export class ProductionAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly changes: ContentChangeService,
  ) {}

  /** The production page is a singleton: the earliest created row is the one edited. */
  async getPage() {
    return this.prisma.productionPage.findFirst({
      orderBy: { createdAt: "asc" },
      include: PAGE_INCLUDE,
    });
  }

  /** Creates the page as DRAFT on first save, otherwise updates it in place. */
  async upsertPage(dto: UpsertCmsPageDto, userId: string) {
    assertUniqueLocales(dto.translations);
    await ensureMediaExists(this.prisma, [dto.heroImageId]);
    const before = await this.getPage();

    const after = await this.prisma.$transaction(async (tx) => {
      const page = before
        ? await tx.productionPage.update({
            where: { id: before.id },
            data: {
              heroTitle: dto.heroTitle,
              heroDescription: dto.heroDescription,
              heroImageId: dto.heroImageId,
            },
          })
        : await tx.productionPage.create({
            data: {
              status: PAGE_STATUS.DRAFT,
              heroTitle: dto.heroTitle ?? null,
              heroDescription: dto.heroDescription ?? null,
              heroImageId: dto.heroImageId ?? null,
            },
          });

      for (const t of dto.translations ?? []) {
        const data = {
          title: t.title ?? null,
          description: t.description ?? null,
        };
        await tx.productionTranslation.upsert({
          where: { pageId_locale: { pageId: page.id, locale: t.locale } },
          create: { ...data, locale: t.locale, pageId: page.id },
          update: data,
        });
      }

      return tx.productionPage.findUniqueOrThrow({
        where: { id: page.id },
        include: PAGE_INCLUDE,
      });
    });

    await this.changes.record({
      userId,
      action: before ? "production_page.update" : "production_page.create",
      entity: "ProductionPage",
      entityId: after.id,
      before,
      after,
    });
    return after;
  }

  async setPageStatus(status: PageStatus, userId: string) {
    const before = await this.requirePage();
    if (status === PAGE_STATUS.PUBLISHED) {
      assertCompleteLocales(before.translations);
    }

    const after = await this.prisma.productionPage.update({
      where: { id: before.id },
      data: { status },
      include: PAGE_INCLUDE,
    });

    await this.changes.record({
      userId,
      action:
        status === PAGE_STATUS.PUBLISHED
          ? "production_page.publish"
          : "production_page.unpublish",
      entity: "ProductionPage",
      entityId: after.id,
      before: { status: before.status },
      after: { status: after.status },
    });
    return after;
  }

  async createStep(dto: CreateProductionStepDto, userId: string) {
    const page = await this.requirePage();
    await ensureMediaExists(this.prisma, [dto.imageId]);

    const step = await this.prisma.productionStep.create({
      data: {
        pageId: page.id,
        title: dto.title,
        description: dto.description ?? null,
        imageId: dto.imageId ?? null,
        sortOrder: dto.sortOrder ?? 0,
      },
      include: { image: true },
    });

    await this.changes.record({
      userId,
      action: "production_step.create",
      entity: "ProductionStep",
      entityId: step.id,
      after: step,
    });
    return step;
  }

  async updateStep(id: string, dto: UpdateProductionStepDto, userId: string) {
    const before = await this.requireStep(id);
    await ensureMediaExists(this.prisma, [dto.imageId]);

    const after = await this.prisma.productionStep.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        imageId: dto.imageId,
        sortOrder: dto.sortOrder,
      },
      include: { image: true },
    });

    await this.changes.record({
      userId,
      action: "production_step.update",
      entity: "ProductionStep",
      entityId: id,
      before,
      after,
    });
    return after;
  }

  /** Steps have no status column; removal is a delete kept in the audit log. */
  async deleteStep(id: string, userId: string) {
    const before = await this.requireStep(id);
    await this.prisma.productionStep.delete({ where: { id } });
    await this.changes.record({
      userId,
      action: "production_step.delete",
      entity: "ProductionStep",
      entityId: id,
      before,
    });
    return { success: true };
  }

  private async requirePage() {
    const page = await this.getPage();
    if (!page) {
      throw new NotFoundException({
        code: ErrorCode.PAGE_NOT_FOUND,
        message:
          "Production page does not exist yet; save it first (PUT /admin/production)",
      });
    }
    return page;
  }

  private async requireStep(id: string) {
    const step = await this.prisma.productionStep.findUnique({
      where: { id },
      include: { image: true },
    });
    if (!step) {
      throw new NotFoundException({
        code: ErrorCode.RESOURCE_NOT_FOUND,
        message: "Production step not found",
      });
    }
    return step;
  }
}
