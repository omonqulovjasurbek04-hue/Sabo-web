import { BadRequestException, NotFoundException } from "@nestjs/common";
import { PAGE_STATUS } from "../common/cms/cms.util";
import { ContentChangeService } from "../common/cms/content-change.service";
import { PrismaService } from "../prisma/prisma.service";
import { AboutAdminService } from "./about-admin.service";

const USER_ID = "user-1";

function makePage(overrides: Record<string, unknown> = {}) {
  return {
    id: "page-1",
    status: PAGE_STATUS.DRAFT as string,
    heroTitle: "SABO",
    translations: [{ locale: "uz", title: "Biz haqimizda" }],
    timelines: [],
    values: [],
    ...overrides,
  };
}

function setup() {
  const prisma = {
    aboutPage: {
      findFirst: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    aboutTranslation: { upsert: jest.fn() },
    aboutTimeline: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    aboutValue: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    teamMember: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    media: { count: jest.fn().mockResolvedValue(1) },
    $transaction: jest.fn(),
  };
  prisma.$transaction.mockImplementation(
    async (callback: (tx: typeof prisma) => unknown) => callback(prisma),
  );
  const changes = { record: jest.fn() };
  const service = new AboutAdminService(
    prisma as unknown as PrismaService,
    changes as unknown as ContentChangeService,
  );
  return { prisma, changes, service };
}

describe("AboutAdminService", () => {
  describe("upsertPage", () => {
    it("creates the page as DRAFT on first save and upserts translations", async () => {
      const { prisma, changes, service } = setup();
      prisma.aboutPage.findFirst.mockResolvedValue(null);
      prisma.aboutPage.create.mockResolvedValue({ id: "page-1" });
      const saved = makePage();
      prisma.aboutPage.findUniqueOrThrow.mockResolvedValue(saved);

      await service.upsertPage(
        {
          heroTitle: "SABO",
          translations: [{ locale: "ru", title: "О нас" }],
        },
        USER_ID,
      );

      expect(prisma.aboutPage.create.mock.calls[0][0].data.status).toBe(
        PAGE_STATUS.DRAFT,
      );
      expect(prisma.aboutTranslation.upsert).toHaveBeenCalledWith({
        where: { pageId_locale: { pageId: "page-1", locale: "ru" } },
        create: {
          title: "О нас",
          description: null,
          locale: "ru",
          pageId: "page-1",
        },
        update: { title: "О нас", description: null },
      });
      expect(changes.record).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "about_page.create",
          entityId: "page-1",
          before: null,
          after: saved,
        }),
      );
    });

    it("updates the existing singleton page instead of creating another", async () => {
      const { prisma, changes, service } = setup();
      const before = makePage({ status: PAGE_STATUS.PUBLISHED });
      prisma.aboutPage.findFirst.mockResolvedValue(before);
      prisma.aboutPage.update.mockResolvedValue({ id: "page-1" });
      prisma.aboutPage.findUniqueOrThrow.mockResolvedValue(before);

      await service.upsertPage({ heroDescription: "Yangi" }, USER_ID);

      expect(prisma.aboutPage.create).not.toHaveBeenCalled();
      expect(prisma.aboutPage.update).toHaveBeenCalledWith({
        where: { id: "page-1" },
        data: {
          heroTitle: undefined,
          heroDescription: "Yangi",
          heroImageId: undefined,
        },
      });
      expect(changes.record).toHaveBeenCalledWith(
        expect.objectContaining({ action: "about_page.update" }),
      );
    });
  });

  describe("setPageStatus", () => {
    it("refuses to publish with missing locales", async () => {
      const { prisma, service } = setup();
      prisma.aboutPage.findFirst.mockResolvedValue(makePage());

      await expect(
        service.setPageStatus(PAGE_STATUS.PUBLISHED, USER_ID),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(prisma.aboutPage.update).not.toHaveBeenCalled();
    });

    it("publishes a fully translated page", async () => {
      const { prisma, changes, service } = setup();
      prisma.aboutPage.findFirst.mockResolvedValue(
        makePage({
          translations: [{ locale: "uz" }, { locale: "ru" }, { locale: "en" }],
        }),
      );
      prisma.aboutPage.update.mockResolvedValue(
        makePage({ status: PAGE_STATUS.PUBLISHED }),
      );

      await service.setPageStatus(PAGE_STATUS.PUBLISHED, USER_ID);

      expect(prisma.aboutPage.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { status: PAGE_STATUS.PUBLISHED } }),
      );
      expect(changes.record).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "about_page.publish",
          before: { status: PAGE_STATUS.DRAFT },
          after: { status: PAGE_STATUS.PUBLISHED },
        }),
      );
    });

    it("unpublishes back to DRAFT without a locale check", async () => {
      const { prisma, service } = setup();
      prisma.aboutPage.findFirst.mockResolvedValue(
        makePage({ status: PAGE_STATUS.PUBLISHED }),
      );
      prisma.aboutPage.update.mockResolvedValue(makePage());

      await service.setPageStatus(PAGE_STATUS.DRAFT, USER_ID);

      expect(prisma.aboutPage.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { status: PAGE_STATUS.DRAFT } }),
      );
    });
  });

  describe("timeline & values", () => {
    it("requires the page to exist before adding timeline items", async () => {
      const { prisma, service } = setup();
      prisma.aboutPage.findFirst.mockResolvedValue(null);

      await expect(
        service.createTimeline({ year: "2018", title: "Boshlanish" }, USER_ID),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("attaches new timeline items to the singleton page", async () => {
      const { prisma, service } = setup();
      prisma.aboutPage.findFirst.mockResolvedValue(makePage());
      prisma.aboutTimeline.create.mockResolvedValue({ id: "tl-1" });

      await service.createTimeline(
        { year: "2018", title: "Boshlanish" },
        USER_ID,
      );

      expect(prisma.aboutTimeline.create.mock.calls[0][0].data).toEqual({
        pageId: "page-1",
        year: "2018",
        title: "Boshlanish",
        description: null,
        imageId: null,
        sortOrder: 0,
      });
    });

    it("keeps a snapshot of a deleted timeline item in the audit log", async () => {
      const { prisma, changes, service } = setup();
      const item = { id: "tl-1", year: "2018", title: "Boshlanish" };
      prisma.aboutTimeline.findUnique.mockResolvedValue(item);

      await service.deleteTimeline("tl-1", USER_ID);

      expect(prisma.aboutTimeline.delete).toHaveBeenCalledWith({
        where: { id: "tl-1" },
      });
      expect(changes.record).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "about_timeline.delete",
          before: item,
        }),
      );
    });

    it("404s when updating an unknown value", async () => {
      const { prisma, service } = setup();
      prisma.aboutValue.findUnique.mockResolvedValue(null);

      await expect(
        service.updateValue("missing", { title: "x" }, USER_ID),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("team", () => {
    it("hides a team member instead of deleting", async () => {
      const { prisma, changes, service } = setup();
      prisma.teamMember.findUnique.mockResolvedValue({
        id: "tm-1",
        isActive: true,
      });
      prisma.teamMember.update.mockResolvedValue({
        id: "tm-1",
        isActive: false,
      });

      await service.setTeamMemberActive("tm-1", false, USER_ID);

      expect(prisma.teamMember.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { isActive: false } }),
      );
      expect(changes.record).toHaveBeenCalledWith(
        expect.objectContaining({ action: "team_member.deactivate" }),
      );
    });
  });
});
