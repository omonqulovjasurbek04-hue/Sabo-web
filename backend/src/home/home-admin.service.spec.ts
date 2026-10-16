import { NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { ContentChangeService } from "../common/cms/content-change.service";
import { PrismaService } from "../prisma/prisma.service";
import { HomeAdminService } from "./home-admin.service";

const USER_ID = "user-1";

function setup() {
  const prisma = {
    homeHero: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    homeSection: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    media: { count: jest.fn().mockResolvedValue(1) },
  };
  const changes = { record: jest.fn() };
  const service = new HomeAdminService(
    prisma as unknown as PrismaService,
    changes as unknown as ContentChangeService,
  );
  return { prisma, changes, service };
}

describe("HomeAdminService", () => {
  it("stores hero buttons as JSON and audits the new slide", async () => {
    const { prisma, changes, service } = setup();
    prisma.homeHero.create.mockResolvedValue({ id: "hero-1" });

    await service.createHero(
      {
        title: "Tabiiy sut",
        primaryButton: { label: "Mahsulotlar", href: "/products" },
      },
      USER_ID,
    );

    const { data } = prisma.homeHero.create.mock.calls[0][0];
    expect(data.primaryButton).toEqual({
      label: "Mahsulotlar",
      href: "/products",
    });
    expect(data.secondaryButton).toBeUndefined();
    expect(data.isActive).toBe(true);
    expect(changes.record).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "home_hero.create",
        entity: "HomeHero",
        entityId: "hero-1",
      }),
    );
  });

  it("clears a hero button with SQL NULL when null is sent", async () => {
    const { prisma, service } = setup();
    prisma.homeHero.findUnique.mockResolvedValue({ id: "hero-1" });
    prisma.homeHero.update.mockResolvedValue({ id: "hero-1" });

    await service.updateHero("hero-1", { secondaryButton: null }, USER_ID);

    const { data } = prisma.homeHero.update.mock.calls[0][0];
    expect(data.secondaryButton).toBe(Prisma.DbNull);
    expect(data.primaryButton).toBeUndefined();
  });

  it("hides a hero slide instead of deleting it", async () => {
    const { prisma, changes, service } = setup();
    prisma.homeHero.findUnique.mockResolvedValue({
      id: "hero-1",
      isActive: true,
    });
    prisma.homeHero.update.mockResolvedValue({ id: "hero-1", isActive: false });

    await service.setHeroActive("hero-1", false, USER_ID);

    expect(prisma.homeHero.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { isActive: false } }),
    );
    expect(changes.record).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "home_hero.deactivate",
        before: { isActive: true },
        after: { isActive: false },
      }),
    );
  });

  it("creates sections with metadata JSON", async () => {
    const { prisma, service } = setup();
    prisma.homeSection.create.mockResolvedValue({ id: "sec-1" });

    await service.createSection(
      { type: "benefits", title: "Afzalliklar", metadata: { columns: 3 } },
      USER_ID,
    );

    expect(prisma.homeSection.create.mock.calls[0][0].data).toEqual(
      expect.objectContaining({
        type: "benefits",
        metadata: { columns: 3 },
        isActive: true,
        sortOrder: 0,
      }),
    );
  });

  it("re-activates a section and audits it", async () => {
    const { prisma, changes, service } = setup();
    prisma.homeSection.findUnique.mockResolvedValue({
      id: "sec-1",
      isActive: false,
    });
    prisma.homeSection.update.mockResolvedValue({
      id: "sec-1",
      isActive: true,
    });

    await service.setSectionActive("sec-1", true, USER_ID);

    expect(changes.record).toHaveBeenCalledWith(
      expect.objectContaining({ action: "home_section.activate" }),
    );
  });

  it("404s for an unknown section", async () => {
    const { prisma, service } = setup();
    prisma.homeSection.findUnique.mockResolvedValue(null);

    await expect(
      service.updateSection("missing", { title: "x" }, USER_ID),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
