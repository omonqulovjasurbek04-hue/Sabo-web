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
  CreateAboutTimelineDto,
  CreateAboutValueDto,
  CreateTeamMemberDto,
  UpdateAboutTimelineDto,
  UpdateAboutValueDto,
  UpdateTeamMemberDto,
} from "./dto/about-admin.dto";

const PAGE_INCLUDE = {
  translations: { orderBy: { locale: "asc" } },
  heroImage: true,
  timelines: { include: { image: true }, orderBy: { sortOrder: "asc" } },
  values: { orderBy: { sortOrder: "asc" } },
} satisfies Prisma.AboutPageInclude;

const TEAM_INCLUDE = { photo: true } satisfies Prisma.TeamMemberInclude;

type PageStatus = (typeof PAGE_STATUS)[keyof typeof PAGE_STATUS];

@Injectable()
export class AboutAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly changes: ContentChangeService,
  ) {}

  // ==========================================
  // PAGE (singleton)
  // ==========================================

  /** The about page is a singleton: the earliest created row is the one edited. */
  async getPage() {
    return this.prisma.aboutPage.findFirst({
      orderBy: { createdAt: "asc" },
      include: PAGE_INCLUDE,
    });
  }

  async getOverview() {
    const [page, team] = await Promise.all([this.getPage(), this.listTeam()]);
    return { page, team };
  }

  /** Creates the page as DRAFT on first save, otherwise updates it in place. */
  async upsertPage(dto: UpsertCmsPageDto, userId: string) {
    assertUniqueLocales(dto.translations);
    await ensureMediaExists(this.prisma, [dto.heroImageId]);
    const before = await this.getPage();

    const after = await this.prisma.$transaction(async (tx) => {
      const page = before
        ? await tx.aboutPage.update({
            where: { id: before.id },
            data: {
              heroTitle: dto.heroTitle,
              heroDescription: dto.heroDescription,
              heroImageId: dto.heroImageId,
            },
          })
        : await tx.aboutPage.create({
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
        await tx.aboutTranslation.upsert({
          where: { pageId_locale: { pageId: page.id, locale: t.locale } },
          create: { ...data, locale: t.locale, pageId: page.id },
          update: data,
        });
      }

      return tx.aboutPage.findUniqueOrThrow({
        where: { id: page.id },
        include: PAGE_INCLUDE,
      });
    });

    await this.changes.record({
      userId,
      action: before ? "about_page.update" : "about_page.create",
      entity: "AboutPage",
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

    const after = await this.prisma.aboutPage.update({
      where: { id: before.id },
      data: { status },
      include: PAGE_INCLUDE,
    });

    await this.changes.record({
      userId,
      action:
        status === PAGE_STATUS.PUBLISHED
          ? "about_page.publish"
          : "about_page.unpublish",
      entity: "AboutPage",
      entityId: after.id,
      before: { status: before.status },
      after: { status: after.status },
    });
    return after;
  }

  // ==========================================
  // TIMELINE
  // ==========================================

  async createTimeline(dto: CreateAboutTimelineDto, userId: string) {
    const page = await this.requirePage();
    await ensureMediaExists(this.prisma, [dto.imageId]);

    const item = await this.prisma.aboutTimeline.create({
      data: {
        pageId: page.id,
        year: dto.year,
        title: dto.title,
        description: dto.description ?? null,
        imageId: dto.imageId ?? null,
        sortOrder: dto.sortOrder ?? 0,
      },
      include: { image: true },
    });

    await this.changes.record({
      userId,
      action: "about_timeline.create",
      entity: "AboutTimeline",
      entityId: item.id,
      after: item,
    });
    return item;
  }

  async updateTimeline(
    id: string,
    dto: UpdateAboutTimelineDto,
    userId: string,
  ) {
    const before = await this.requireTimeline(id);
    await ensureMediaExists(this.prisma, [dto.imageId]);

    const after = await this.prisma.aboutTimeline.update({
      where: { id },
      data: {
        year: dto.year,
        title: dto.title,
        description: dto.description,
        imageId: dto.imageId,
        sortOrder: dto.sortOrder,
      },
      include: { image: true },
    });

    await this.changes.record({
      userId,
      action: "about_timeline.update",
      entity: "AboutTimeline",
      entityId: id,
      before,
      after,
    });
    return after;
  }

  /** Timeline rows have no status column; removal is a delete kept in the audit log. */
  async deleteTimeline(id: string, userId: string) {
    const before = await this.requireTimeline(id);
    await this.prisma.aboutTimeline.delete({ where: { id } });
    await this.changes.record({
      userId,
      action: "about_timeline.delete",
      entity: "AboutTimeline",
      entityId: id,
      before,
    });
    return { success: true };
  }

  // ==========================================
  // VALUES
  // ==========================================

  async createValue(dto: CreateAboutValueDto, userId: string) {
    const page = await this.requirePage();

    const item = await this.prisma.aboutValue.create({
      data: {
        pageId: page.id,
        title: dto.title,
        description: dto.description ?? null,
        icon: dto.icon ?? null,
        sortOrder: dto.sortOrder ?? 0,
      },
    });

    await this.changes.record({
      userId,
      action: "about_value.create",
      entity: "AboutValue",
      entityId: item.id,
      after: item,
    });
    return item;
  }

  async updateValue(id: string, dto: UpdateAboutValueDto, userId: string) {
    const before = await this.requireValue(id);

    const after = await this.prisma.aboutValue.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        icon: dto.icon,
        sortOrder: dto.sortOrder,
      },
    });

    await this.changes.record({
      userId,
      action: "about_value.update",
      entity: "AboutValue",
      entityId: id,
      before,
      after,
    });
    return after;
  }

  async deleteValue(id: string, userId: string) {
    const before = await this.requireValue(id);
    await this.prisma.aboutValue.delete({ where: { id } });
    await this.changes.record({
      userId,
      action: "about_value.delete",
      entity: "AboutValue",
      entityId: id,
      before,
    });
    return { success: true };
  }

  // ==========================================
  // TEAM
  // ==========================================

  async listTeam() {
    return this.prisma.teamMember.findMany({
      include: TEAM_INCLUDE,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  }

  async createTeamMember(dto: CreateTeamMemberDto, userId: string) {
    await ensureMediaExists(this.prisma, [dto.photoMediaId]);

    const member = await this.prisma.teamMember.create({
      data: {
        name: dto.name,
        position: dto.position,
        photoMediaId: dto.photoMediaId ?? null,
        bio: dto.bio ?? null,
        sortOrder: dto.sortOrder ?? 0,
        isActive: dto.isActive ?? true,
      },
      include: TEAM_INCLUDE,
    });

    await this.changes.record({
      userId,
      action: "team_member.create",
      entity: "TeamMember",
      entityId: member.id,
      after: member,
    });
    return member;
  }

  async updateTeamMember(id: string, dto: UpdateTeamMemberDto, userId: string) {
    const before = await this.requireTeamMember(id);
    await ensureMediaExists(this.prisma, [dto.photoMediaId]);

    const after = await this.prisma.teamMember.update({
      where: { id },
      data: {
        name: dto.name,
        position: dto.position,
        photoMediaId: dto.photoMediaId,
        bio: dto.bio,
        sortOrder: dto.sortOrder,
      },
      include: TEAM_INCLUDE,
    });

    await this.changes.record({
      userId,
      action: "team_member.update",
      entity: "TeamMember",
      entityId: id,
      before,
      after,
    });
    return after;
  }

  /** Show / hide a team member. Members are never hard-deleted. */
  async setTeamMemberActive(id: string, isActive: boolean, userId: string) {
    const before = await this.requireTeamMember(id);

    const after = await this.prisma.teamMember.update({
      where: { id },
      data: { isActive },
      include: TEAM_INCLUDE,
    });

    await this.changes.record({
      userId,
      action: isActive ? "team_member.activate" : "team_member.deactivate",
      entity: "TeamMember",
      entityId: id,
      before: { isActive: before.isActive },
      after: { isActive: after.isActive },
    });
    return after;
  }

  // ==========================================
  // HELPERS
  // ==========================================

  private async requirePage() {
    const page = await this.getPage();
    if (!page) {
      throw new NotFoundException({
        code: ErrorCode.PAGE_NOT_FOUND,
        message:
          "About page does not exist yet; save it first (PUT /admin/about)",
      });
    }
    return page;
  }

  private async requireTimeline(id: string) {
    const item = await this.prisma.aboutTimeline.findUnique({
      where: { id },
      include: { image: true },
    });
    if (!item) throw this.notFound("Timeline item");
    return item;
  }

  private async requireValue(id: string) {
    const item = await this.prisma.aboutValue.findUnique({ where: { id } });
    if (!item) throw this.notFound("Value item");
    return item;
  }

  private async requireTeamMember(id: string) {
    const member = await this.prisma.teamMember.findUnique({
      where: { id },
      include: TEAM_INCLUDE,
    });
    if (!member) throw this.notFound("Team member");
    return member;
  }

  private notFound(label: string) {
    return new NotFoundException({
      code: ErrorCode.RESOURCE_NOT_FOUND,
      message: `${label} not found`,
    });
  }
}
