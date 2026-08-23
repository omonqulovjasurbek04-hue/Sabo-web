import { Injectable } from "@nestjs/common";
import { pickTranslation } from "../common/utils/localization.util";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AboutService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicAboutPage(locale = "uz") {
    const page = await this.prisma.aboutPage.findFirst({
      where: { status: "PUBLISHED" },
      include: {
        translations: true,
        heroImage: true,
        timelines: {
          include: { image: true },
          orderBy: { sortOrder: "asc" },
        },
        values: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    const team = await this.prisma.teamMember.findMany({
      where: { isActive: true },
      include: { photo: true },
      orderBy: { sortOrder: "asc" },
    });

    if (!page) {
      return {
        heroTitle: null,
        heroDescription: null,
        heroImage: null,
        timelines: [],
        values: [],
        team: team.map((m) => ({
          id: m.id,
          name: m.name,
          position: m.position,
          bio: m.bio,
          photo: m.photo ? { id: m.photo.id, url: m.photo.url } : null,
        })),
      };
    }

    const trans = pickTranslation(page.translations, locale);
    return {
      id: page.id,
      heroTitle: trans?.title || page.heroTitle,
      heroDescription: trans?.description || page.heroDescription,
      heroImage: page.heroImage
        ? { id: page.heroImage.id, url: page.heroImage.url }
        : null,
      timelines: page.timelines.map((t) => ({
        id: t.id,
        year: t.year,
        title: t.title,
        description: t.description,
        image: t.image ? { id: t.image.id, url: t.image.url } : null,
      })),
      values: page.values.map((v) => ({
        id: v.id,
        title: v.title,
        description: v.description,
        icon: v.icon,
      })),
      team: team.map((m) => ({
        id: m.id,
        name: m.name,
        position: m.position,
        bio: m.bio,
        photo: m.photo ? { id: m.photo.id, url: m.photo.url } : null,
      })),
    };
  }
}
