import { BadRequestException, NotFoundException } from "@nestjs/common";
import { PAGE_STATUS } from "../common/cms/cms.util";
import { ContentChangeService } from "../common/cms/content-change.service";
import { PrismaService } from "../prisma/prisma.service";
import { ProductionAdminService } from "./production-admin.service";

const USER_ID = "user-1";

function makePage(overrides: Record<string, unknown> = {}) {
  return {
    id: "page-1",
    status: PAGE_STATUS.DRAFT as string,
    translations: [{ locale: "uz" }, { locale: "ru" }],
    steps: [],
    ...overrides,
  };
}

function setup() {
  const prisma = {
    productionPage: {
      findFirst: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    productionTranslation: { upsert: jest.fn() },
    productionStep: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    media: { count: jest.fn().mockResolvedValue(1) },
    $transaction: jest.fn(),
  };
  prisma.$transaction.mockImplementation(
    async (callback: (tx: typeof prisma) => unknown) => callback(prisma),
  );
  const changes = { record: jest.fn() };
  const service = new ProductionAdminService(
    prisma as unknown as PrismaService,
    changes as unknown as ContentChangeService,
  );
  return { prisma, changes, service };
}

describe("ProductionAdminService", () => {
  it("creates the page as DRAFT on first save", async () => {
    const { prisma, changes, service } = setup();
    prisma.productionPage.findFirst.mockResolvedValue(null);
    prisma.productionPage.create.mockResolvedValue({ id: "page-1" });
    prisma.productionPage.findUniqueOrThrow.mockResolvedValue(makePage());

    await service.upsertPage(
      { translations: [{ locale: "en", title: "Production" }] },
      USER_ID,
    );

    expect(prisma.productionPage.create.mock.calls[0][0].data.status).toBe(
      PAGE_STATUS.DRAFT,
    );
    expect(prisma.productionTranslation.upsert).toHaveBeenCalledTimes(1);
    expect(changes.record).toHaveBeenCalledWith(
      expect.objectContaining({ action: "production_page.create" }),
    );
  });

  it("rejects duplicate locales in one request", async () => {
    const { prisma, service } = setup();

    await expect(
      service.upsertPage(
        {
          translations: [
            { locale: "uz", title: "a" },
            { locale: "uz", title: "b" },
          ],
        },
        USER_ID,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it("refuses to publish while the en translation is missing", async () => {
    const { prisma, service } = setup();
    prisma.productionPage.findFirst.mockResolvedValue(makePage());

    await expect(
      service.setPageStatus(PAGE_STATUS.PUBLISHED, USER_ID),
    ).rejects.toThrow(/en/);
    expect(prisma.productionPage.update).not.toHaveBeenCalled();
  });

  it("404s on publish when no page exists", async () => {
    const { prisma, service } = setup();
    prisma.productionPage.findFirst.mockResolvedValue(null);

    await expect(
      service.setPageStatus(PAGE_STATUS.PUBLISHED, USER_ID),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("creates a step on the singleton page and audits it", async () => {
    const { prisma, changes, service } = setup();
    prisma.productionPage.findFirst.mockResolvedValue(makePage());
    prisma.productionStep.create.mockResolvedValue({ id: "step-1" });

    await service.createStep(
      { title: "Sut qabul qilish", sortOrder: 1 },
      USER_ID,
    );

    expect(prisma.productionStep.create.mock.calls[0][0].data).toEqual({
      pageId: "page-1",
      title: "Sut qabul qilish",
      description: null,
      imageId: null,
      sortOrder: 1,
    });
    expect(changes.record).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "production_step.create",
        entityId: "step-1",
      }),
    );
  });

  it("updates a step with only the provided fields", async () => {
    const { prisma, service } = setup();
    prisma.productionStep.findUnique.mockResolvedValue({ id: "step-1" });
    prisma.productionStep.update.mockResolvedValue({ id: "step-1" });

    await service.updateStep("step-1", { description: null }, USER_ID);

    expect(prisma.productionStep.update.mock.calls[0][0].data).toEqual({
      title: undefined,
      description: null,
      imageId: undefined,
      sortOrder: undefined,
    });
  });

  it("deletes a step with an audit snapshot", async () => {
    const { prisma, changes, service } = setup();
    const step = { id: "step-1", title: "Pasterizatsiya" };
    prisma.productionStep.findUnique.mockResolvedValue(step);

    await service.deleteStep("step-1", USER_ID);

    expect(prisma.productionStep.delete).toHaveBeenCalled();
    expect(changes.record).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "production_step.delete",
        before: step,
      }),
    );
  });
});
