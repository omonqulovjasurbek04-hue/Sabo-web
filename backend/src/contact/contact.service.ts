import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import * as crypto from "crypto";
import { APP_CONSTANTS } from "../config/constants";
import { ErrorCode } from "../common/enums/error-code.enum";
import { RedisService } from "../common/redis/redis.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateContactMessageDto } from "./dto/create-contact.dto";

@Injectable()
export class ContactService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  private hashIp(ip?: string): string | null {
    if (!ip) return null;
    return crypto.createHash("sha256").update(ip).digest("hex");
  }

  async submitMessage(
    dto: CreateContactMessageDto,
    ip?: string,
    userAgent?: string,
  ) {
    // 1. Honeypot check: If bot filled `websiteUrl`, silently reject / mark spam
    if (dto.websiteUrl) {
      return { success: true, message: "Message submitted successfully" };
    }

    // 2. Redis Rate Limiting (5 messages per hour per IP)
    const ipHash = this.hashIp(ip);
    if (ipHash) {
      const rateKey = `rate:contact:${ipHash}`;
      const count = await this.redis.get(rateKey);
      if (
        count &&
        parseInt(count, 10) >= APP_CONSTANTS.RATE_LIMITS.CONTACT_LIMIT
      ) {
        throw new ForbiddenException({
          code: ErrorCode.CONTACT_RATE_LIMITED,
          message: "Too many messages sent. Please try again later.",
        });
      }

      const nextCount = count ? parseInt(count, 10) + 1 : 1;
      await this.redis.set(rateKey, nextCount.toString(), 3600); // 1 hour TTL
    }

    if (!dto.phone && !dto.email) {
      throw new BadRequestException({
        code: ErrorCode.VALIDATION_ERROR,
        message: "Please provide either phone number or email address",
      });
    }

    await this.prisma.contactMessage.create({
      data: {
        name: dto.name,
        phone: dto.phone || null,
        email: dto.email ? dto.email.toLowerCase() : null,
        message: dto.message,
        ipHash,
        userAgent: userAgent || null,
      },
    });

    return {
      success: true,
      message:
        "Your message has been received. We will get back to you shortly.",
    };
  }

  async getSiteContact() {
    const contact = await this.prisma.siteContact.findFirst();
    if (!contact) {
      return {
        phone: null,
        email: null,
        address: null,
        workingHours: null,
        mapUrl: null,
        latitude: null,
        longitude: null,
        socialLinks: null,
      };
    }

    return {
      phone: contact.phone,
      email: contact.email,
      address: contact.address,
      workingHours: contact.workingHours,
      mapUrl: contact.mapUrl,
      latitude: contact.latitude,
      longitude: contact.longitude,
      socialLinks: contact.socialLinks,
    };
  }
}
