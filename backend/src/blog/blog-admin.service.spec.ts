import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { BlogStatus } from "@prisma/client";
import { ContentChangeService } from "../common/cms/content-change.service";
import { PrismaService } from "../prisma/prisma.service";
import { BlogAdminService } from "./blog-admin.service";
import { BlogPostTranslationDto } from "./dto/blog-admin.dto";

const USER_ID = "user-1";

function translation(locale: "uz" | "ru" | "en"): BlogPostTranslationDto {
  return { locale, title: `Title ${locale}`, content: `Body ${locale}` };
}

function makePost(overrides: Record<string, unknown> = {}) {
  return {
    id: "post-1",
    slug: "sut-foydalari",
    status: BlogStatus.DRAFT,
    publishedAt: null as Date | null,
    deletedAt: null,
    translations: [translation("uz")],
    ...overrides,
  };
}

function setup() {
  const prisma = {
    blogPost: {
      findMany: jest.fn(),
      count: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      update: jest.fn(),
    },
    blogPostTranslation: { upsert: jest.fn() },
    blogCategory: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    blogCategoryTranslation: { upsert: jest.fn() },
    media: { count: jest.fn() },
    $transaction: jest.fn(),
  };
  prisma.$transaction.mockImplementation(
    async (callback: (tx: typeof prisma) => unknown) => callback(prisma),
  );
  const changes = { record: jest.fn() };
  const service = new BlogAdminService(
    prisma as unknown as PrismaService,
    changes as unknown as ContentChangeService,
  );
  return { prisma, changes, service };
}

describe("BlogAdminService", () => {
  describe("createPost", () => {
    it("creates a DRAFT post owned by the editor and audits it", async () => {
      const { prisma, changes, service } = setup();
      const created = makePost();
      prisma.blogPost.create.mockResolvedValue(created);

      const result = await service.createPost(
        { slug: "sut-foydalari", translations: [translation("uz")] },
        USER_ID,
      );

      expect(result).toBe(created);
      const { data } = prisma.blogPost.create.mock.calls[0][0];
      expect(data.status).toBe(BlogStatus.DRAFT);
      expect(data.authorId).toBe(USER_ID);
      expect(data.translations.createMany.data).toEqual([
        {
          locale: "uz",
          title: "Title uz",
          excerpt: null,
          content: "Body uz",
          seoTitle: null,
          seoDescription: null,
        },
      ]);
      expect(changes.record).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: USER_ID,
          action: "blog_post.create",
          entity: "BlogPost",
          entityId: "post-1",
        }),
      );
    });

    it("rejects duplicate locales before touching the database", async () => {
      const { prisma, service } = setup();

      await expect(
        service.createPost(
          {
            slug: "x",
            translations: [translation("uz"), translation("uz")],
          },
          USER_ID,
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(prisma.blogPost.create).not.toHaveBeenCalled();
    });

    it("rejects a slug that is already taken", async () => {
      const { prisma, service } = setup();
      prisma.blogPost.findUnique.mockResolvedValue({ id: "other" });

      await expect(
        service.createPost(
          { slug: "taken", translations: [translation("uz")] },
          USER_ID,
        ),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it("rejects an unknown cover image", async () => {
      const { prisma, service } = setup();
      prisma.media.count.mockResolvedValue(0);

      await expect(
        service.createPost(
          {
            slug: "x",
            coverImageId: "11111111-1111-4111-8111-111111111111",
            translations: [translation("uz")],
          },
          USER_ID,
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(prisma.blogPost.create).not.toHaveBeenCalled();
    });
  });

  describe("updatePost", () => {
    it("upserts translations per locale and audits before/after", async () => {
      const { prisma, changes, service } = setup();
      const before = makePost();
      const after = makePost({ slug: "yangi-slug" });
      prisma.blogPost.findFirst.mockResolvedValue(before);
      prisma.blogPost.update.mockResolvedValue(after);

      await service.updatePost(
        "post-1",
        { slug: "yangi-slug", translations: [translation("ru")] },
        USER_ID,
      );

      expect(prisma.blogPostTranslation.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { postId_locale: { postId: "post-1", locale: "ru" } },
        }),
      );
      expect(prisma.blogPost.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "post-1" },
          data: {
            slug: "yangi-slug",
            categoryId: undefined,
            coverImageId: undefined,
          },
        }),
      );
      expect(changes.record).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "blog_post.update",
          before,
          after,
        }),
      );
    });

    it("404s for a missing or soft-deleted post", async () => {
      const { prisma, service } = setup();
      prisma.blogPost.findFirst.mockResolvedValue(null);

      await expect(
        service.updatePost("missing", {}, USER_ID),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("setPostStatus", () => {
    it("refuses to publish without uz, ru and en translations", async () => {
      const { prisma, changes, service } = setup();
      prisma.blogPost.findFirst.mockResolvedValue(
        makePost({ translations: [translation("uz"), translation("en")] }),
      );

      await expect(
        service.setPostStatus("post-1", BlogStatus.PUBLISHED, USER_ID),
      ).rejects.toThrow(/ru/);
      expect(prisma.blogPost.update).not.toHaveBeenCalled();
      expect(changes.record).not.toHaveBeenCalled();
    });

    it("keeps the original publishedAt when re-publishing", async () => {
      const { prisma, service } = setup();
      const firstPublished = new Date("2026-01-01T00:00:00Z");
      prisma.blogPost.findFirst.mockResolvedValue(
        makePost({
          publishedAt: firstPublished,
          translations: [
            translation("uz"),
            translation("ru"),
            translation("en"),
          ],
        }),
      );
      prisma.blogPost.update.mockResolvedValue(
        makePost({
          status: BlogStatus.PUBLISHED,
          publishedAt: firstPublished,
        }),
      );

      await service.setPostStatus("post-1", BlogStatus.PUBLISHED, USER_ID);

      expect(prisma.blogPost.update.mock.calls[0][0].data).toEqual({
        status: BlogStatus.PUBLISHED,
        publishedAt: firstPublished,
      });
    });

    it("archives instead of deleting and audits the status change", async () => {
      const { prisma, changes, service } = setup();
      prisma.blogPost.findFirst.mockResolvedValue(
        makePost({ status: BlogStatus.PUBLISHED }),
      );
      prisma.blogPost.update.mockResolvedValue(
        makePost({ status: BlogStatus.ARCHIVED }),
      );

      await service.setPostStatus("post-1", BlogStatus.ARCHIVED, USER_ID);

      expect(prisma.blogPost.update.mock.calls[0][0].data.status).toBe(
        BlogStatus.ARCHIVED,
      );
      expect(changes.record).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "blog_post.archive",
          before: expect.objectContaining({ status: BlogStatus.PUBLISHED }),
          after: expect.objectContaining({ status: BlogStatus.ARCHIVED }),
        }),
      );
    });
  });

  describe("categories", () => {
    it("refuses to delete a category that still has posts", async () => {
      const { prisma, service } = setup();
      prisma.blogCategory.findUnique.mockResolvedValue({
        id: "cat-1",
        _count: { posts: 2 },
      });

      await expect(
        service.deleteCategory("cat-1", USER_ID),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(prisma.blogCategory.delete).not.toHaveBeenCalled();
    });

    it("deletes an unused category and audits the removed row", async () => {
      const { prisma, changes, service } = setup();
      const category = { id: "cat-1", slug: "x", _count: { posts: 0 } };
      prisma.blogCategory.findUnique.mockResolvedValue(category);

      await service.deleteCategory("cat-1", USER_ID);

      expect(prisma.blogCategory.delete).toHaveBeenCalledWith({
        where: { id: "cat-1" },
      });
      expect(changes.record).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "blog_category.delete",
          before: category,
        }),
      );
    });

    it("upserts category translations on update", async () => {
      const { prisma, service } = setup();
      prisma.blogCategory.findUnique.mockResolvedValue({
        id: "cat-1",
        slug: "x",
        _count: { posts: 0 },
      });
      prisma.blogCategory.update.mockResolvedValue({ id: "cat-1" });

      await service.updateCategory(
        "cat-1",
        { translations: [{ locale: "en", name: "Health" }] },
        USER_ID,
      );

      expect(prisma.blogCategoryTranslation.upsert).toHaveBeenCalledWith({
        where: { categoryId_locale: { categoryId: "cat-1", locale: "en" } },
        create: {
          name: "Health",
          description: null,
          locale: "en",
          categoryId: "cat-1",
        },
        update: { name: "Health", description: null },
      });
    });
  });
});
