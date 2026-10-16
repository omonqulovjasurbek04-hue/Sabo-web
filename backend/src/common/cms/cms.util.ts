import { BadRequestException } from "@nestjs/common";
import { Prisma, RoleType } from "@prisma/client";
import { ValidateIf } from "class-validator";
import { APP_CONSTANTS } from "../../config/constants";
import { PrismaService } from "../../prisma/prisma.service";
import { ErrorCode } from "../enums/error-code.enum";

/** Roles allowed to edit CMS content (blog, certificates, about, production, home). */
export const CMS_EDITOR_ROLES: RoleType[] = [
  RoleType.SUPER_ADMIN,
  RoleType.ADMIN,
  RoleType.EDITOR,
];

/** Matches `home:<locale>` keys written by `HomeService.getHomeData`. */
export const HOME_CACHE_PATTERN = "home:*";

export const SUPPORTED_LOCALES = APP_CONSTANTS.SUPPORTED_LOCALES;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/** `AboutPage.status` / `ProductionPage.status` are plain strings in the schema. */
export const PAGE_STATUS = {
  PUBLISHED: "PUBLISHED",
  DRAFT: "DRAFT",
} as const;

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Like `@IsOptional()` but only skips validation for `undefined`, so an explicit
 * `null` is rejected for columns that are NOT NULL in the database.
 */
export function IsOptionalNotNull(): PropertyDecorator {
  return ValidateIf((_object: object, value: unknown) => value !== undefined);
}

interface LocalizedRecord {
  locale: string;
}

export function assertUniqueLocales(
  translations: LocalizedRecord[] | undefined,
): void {
  if (!translations) return;
  const seen = new Set<string>();
  for (const t of translations) {
    if (seen.has(t.locale)) {
      throw new BadRequestException({
        code: ErrorCode.VALIDATION_ERROR,
        message: `Duplicate translation locale: ${t.locale}`,
      });
    }
    seen.add(t.locale);
  }
}

/** Publishing requires a translation for every supported locale (uz, ru, en). */
export function assertCompleteLocales(translations: LocalizedRecord[]): void {
  const present = new Set(translations.map((t) => t.locale));
  const missing = SUPPORTED_LOCALES.filter((l) => !present.has(l));
  if (missing.length > 0) {
    throw new BadRequestException({
      code: ErrorCode.VALIDATION_ERROR,
      message: `Cannot publish: missing translations for ${missing.join(", ")}`,
    });
  }
}

export function toJsonValue(value: object): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

/** For nullable `Json?` columns: `undefined` → unchanged, `null` → SQL NULL. */
export function toNullableJson(
  value: object | null | undefined,
): Prisma.InputJsonValue | Prisma.NullTypes.DbNull | undefined {
  if (value === undefined) return undefined;
  if (value === null) return Prisma.DbNull;
  return toJsonValue(value);
}

/** Rejects references to Media rows that do not exist (instead of a raw FK error). */
export async function ensureMediaExists(
  prisma: PrismaService,
  ids: Array<string | null | undefined>,
): Promise<void> {
  const unique = [...new Set(ids.filter((id): id is string => !!id))];
  if (unique.length === 0) return;
  const found = await prisma.media.count({ where: { id: { in: unique } } });
  if (found !== unique.length) {
    throw new BadRequestException({
      code: ErrorCode.MEDIA_NOT_FOUND,
      message: "Referenced media file does not exist",
    });
  }
}

/** `undefined` → leave unchanged, `null` → clear, ISO string → Date. */
export function toOptionalDate(
  value: string | null | undefined,
): Date | null | undefined {
  if (value === undefined || value === null) return value;
  return new Date(value);
}
