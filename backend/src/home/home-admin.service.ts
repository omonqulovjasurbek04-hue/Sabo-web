import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { ensureMediaExists, toNullableJson } from "../common/cms/cms.util";
import { ContentChangeService } from "../common/cms/content-change.service";
import { ErrorCode } from "../common/enums/error-code.enum";
import { PrismaService } from "../prisma/prisma.service";
import {
  CreateHomeHeroDto,
  CreateHomeSectionDto,
  UpdateHomeHeroDto,
  UpdateHomeSectionDto,
} from "./dto/home-admin.dto";

const HERO_INCLUDE = {
  backgroundImage: true,
  productImage: true,
} satisfies Prisma.HomeHeroInclude;

const SECTION_INCLUDE = { image: true } satisfies Prisma.HomeSectionInclude;

@Injectable()
export class HomeAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly changes: ContentChangeService,
  ) {}

  // ==========================================
  // HERO
  // ==========================================

  async listHeroes() {
    return this.prisma.homeHero.findMany({
      include: HERO_INCLUDE,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  }

  async createHero(dto: CreateHomeHeroDto, userId: string) {
    await ensureMediaExists(this.prisma, [
      dto.backgroundImageId,
      dto.productImageId,
    ]);

    const hero = await this.prisma.homeHero.create({
      data: {
        title: dto.title,
        subtitle: dto.subtitle ?? null,
        description: dto.description ?? null,
        primaryButton: toNullableJson(dto.primaryButton),
        secondaryButton: toNullableJson(dto.secondaryButton),
        backgroundImageId: dto.backgroundImageId ?? null,
        productImageId: dto.productImageId ?? null,
        sortOrder: dto.sortOrder ?? 0,
        isActive: dto.isActive ?? true,
      },
      include: HERO_INCLUDE,
    });

    await this.changes.record({
      userId,
      action: "home_hero.create",
      entity: "HomeHero",
      entityId: hero.id,
      after: hero,
    });
    return hero;
  }

  async updateHero(id: string, dto: UpdateHomeHeroDto, userId: string) {
    const before = await this.requireHero(id);
    await ensureMediaExists(this.prisma, [
      dto.backgroundImageId,
      dto.productImageId,
    ]);

    const after = await this.prisma.homeHero.update({
      where: { id },
      data: {
        title: dto.title,
        subtitle: dto.subtitle,
        description: dto.description,
        primaryButton: toNullableJson(dto.primaryButton),
        secondaryButton: toNullableJson(dto.secondaryButton),
        backgroundImageId: dto.backgroundImageId,
        productImageId: dto.productImageId,
        sortOrder: dto.sortOrder,
      },
      include: HERO_INCLUDE,
    });

    await this.changes.record({
      userId,
      action: "home_hero.update",
      entity: "HomeHero",
      entityId: id,
      before,
      after,
    });
    return after;
  }

  /** Show / hide a hero slide. Slides are never hard-deleted. */
  async setHeroActive(id: string, isActive: boolean, userId: string) {
    const before = await this.requireHero(id);

    const after = await this.prisma.homeHero.update({
      where: { id },
      data: { isActive },
      include: HERO_INCLUDE,
    });

    await this.changes.record({
      userId,
      action: isActive ? "home_hero.activate" : "home_hero.deactivate",
      entity: "HomeHero",
      entityId: id,
      before: { isActive: before.isActive },
      after: { isActive: after.isActive },
    });
    return after;
  }

  // ==========================================
  // SECTIONS
  // ==========================================

  async listSections() {
    return this.prisma.homeSection.findMany({
      include: SECTION_INCLUDE,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  }

  async createSection(dto: CreateHomeSectionDto, userId: string) {
    await ensureMediaExists(this.prisma, [dto.imageId]);

    const section = await this.prisma.homeSection.create({
      data: {
        type: dto.type,
        title: dto.title,
        description: dto.description ?? null,
        imageId: dto.imageId ?? null,
        sortOrder: dto.sortOrder ?? 0,
        isActive: dto.isActive ?? true,
        metadata: toNullableJson(dto.metadata),
      },
      include: SECTION_INCLUDE,
    });

    await this.changes.record({
      userId,
      action: "home_section.create",
      entity: "HomeSection",
      entityId: section.id,
      after: section,
    });
    return section;
  }

  async updateSection(id: string, dto: UpdateHomeSectionDto, userId: string) {
    const before = await this.requireSection(id);
    await ensureMediaExists(this.prisma, [dto.imageId]);

    const after = await this.prisma.homeSection.update({
      where: { id },
      data: {
        type: dto.type,
        title: dto.title,
        description: dto.description,
        imageId: dto.imageId,
        sortOrder: dto.sortOrder,
        metadata: toNullableJson(dto.metadata),
      },
      include: SECTION_INCLUDE,
    });

    await this.changes.record({
      userId,
      action: "home_section.update",
      entity: "HomeSection",
      entityId: id,
      before,
      after,
    });
    return after;
  }

  /** Show / hide a section. Sections are never hard-deleted. */
  async setSectionActive(id: string, isActive: boolean, userId: string) {
    const before = await this.requireSection(id);

    const after = await this.prisma.homeSection.update({
      where: { id },
      data: { isActive },
      include: SECTION_INCLUDE,
    });

    await this.changes.record({
      userId,
      action: isActive ? "home_section.activate" : "home_section.deactivate",
      entity: "HomeSection",
      entityId: id,
      before: { isActive: before.isActive },
      after: { isActive: after.isActive },
    });
    return after;
  }

  // ==========================================
  // HELPERS
  // ==========================================

  private async requireHero(id: string) {
    const hero = await this.prisma.homeHero.findUnique({
      where: { id },
      include: HERO_INCLUDE,
    });
    if (!hero) throw this.notFound("Home hero");
    return hero;
  }

  private async requireSection(id: string) {
    const section = await this.prisma.homeSection.findUnique({
      where: { id },
      include: SECTION_INCLUDE,
    });
    if (!section) throw this.notFound("Home section");
    return section;
  }

  private notFound(label: string) {
    return new NotFoundException({
      code: ErrorCode.RESOURCE_NOT_FOUND,
      message: `${label} not found`,
    });
  }
}
