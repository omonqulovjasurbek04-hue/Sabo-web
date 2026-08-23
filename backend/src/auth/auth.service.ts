import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { RoleType } from "@prisma/client";
import * as argon2 from "argon2";
import * as crypto from "crypto";
import { ErrorCode } from "../common/enums/error-code.enum";
import { RedisService } from "../common/redis/redis.service";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redis: RedisService,
  ) {}

  private hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  async register(dto: RegisterDto) {
    if (!dto.email && !dto.phone) {
      throw new BadRequestException({
        code: ErrorCode.VALIDATION_ERROR,
        message: "Either email or phone is required to register",
      });
    }

    if (dto.email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: dto.email.toLowerCase() },
      });
      if (existingEmail) {
        throw new ConflictException({
          code: ErrorCode.USER_ALREADY_EXISTS,
          message: "A user with this email already exists",
        });
      }
    }

    if (dto.phone) {
      const existingPhone = await this.prisma.user.findUnique({
        where: { phone: dto.phone },
      });
      if (existingPhone) {
        throw new ConflictException({
          code: ErrorCode.USER_ALREADY_EXISTS,
          message: "A user with this phone number already exists",
        });
      }
    }

    const passwordHash = await argon2.hash(dto.password);

    // Get default CUSTOMER role
    const customerRole = await this.prisma.role.findUnique({
      where: { name: RoleType.CUSTOMER },
    });

    const user = await this.prisma.user.create({
      data: {
        email: dto.email ? dto.email.toLowerCase() : null,
        phone: dto.phone || null,
        passwordHash,
        firstName: dto.firstName || null,
        lastName: dto.lastName || null,
        locale: dto.locale || "uz",
        isVerified: false,
        isActive: true,
        userRoles: customerRole
          ? {
              create: {
                roleId: customerRole.id,
              },
            }
          : undefined,
      },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        locale: true,
        createdAt: true,
      },
    });

    const tokens = await this.generateTokens(user.id);
    return {
      user,
      ...tokens,
    };
  }

  async login(dto: LoginDto, ip?: string) {
    const rateLimitKey = `rate:login:${ip || "ip"}:${dto.identifier.toLowerCase()}`;
    const attempts = await this.redis.get(rateLimitKey);
    if (attempts && parseInt(attempts, 10) >= 5) {
      throw new ForbiddenException({
        code: ErrorCode.RATE_LIMIT_EXCEEDED,
        message: "Too many login attempts. Please try again in 15 minutes.",
      });
    }

    const identifier = dto.identifier.toLowerCase().trim();
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: dto.identifier.trim() }],
      },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || !user.isActive || user.deletedAt) {
      await this.recordFailedAttempt(rateLimitKey);
      throw new UnauthorizedException({
        code: ErrorCode.AUTH_INVALID_CREDENTIALS,
        message: "Invalid credentials or inactive account",
      });
    }

    const isPasswordValid = await argon2.verify(
      user.passwordHash,
      dto.password,
    );
    if (!isPasswordValid) {
      await this.recordFailedAttempt(rateLimitKey);
      throw new UnauthorizedException({
        code: ErrorCode.AUTH_INVALID_CREDENTIALS,
        message: "Invalid credentials or inactive account",
      });
    }

    // Clear failed attempts on success
    await this.redis.del(rateLimitKey);

    // Update lastLoginAt
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user.id, dto.deviceInfo, ip);

    const roles = user.userRoles.map((ur) => ur.role.name);
    const permissions = Array.from(
      new Set(
        user.userRoles.flatMap((ur) =>
          ur.role.rolePermissions.map((rp) => rp.permission.slug),
        ),
      ),
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        locale: user.locale,
        roles,
        permissions,
      },
      ...tokens,
    };
  }

  async refreshToken(dto: RefreshTokenDto, ip?: string) {
    const rawToken = dto.refreshToken;
    const tokenHash = this.hashToken(rawToken);

    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: {
        user: true,
      },
    });

    if (
      !tokenRecord ||
      tokenRecord.isRevoked ||
      new Date() > tokenRecord.expiresAt ||
      !tokenRecord.user.isActive ||
      tokenRecord.user.deletedAt
    ) {
      throw new UnauthorizedException({
        code: ErrorCode.AUTH_REFRESH_REVOKED,
        message: "Refresh token is expired, revoked, or invalid",
      });
    }

    // Revoke old token
    await this.prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { isRevoked: true, revokedAt: new Date() },
    });

    // Generate new pair
    return this.generateTokens(
      tokenRecord.userId,
      tokenRecord.deviceInfo || undefined,
      ip,
    );
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      const tokenHash = this.hashToken(refreshToken);
      await this.prisma.refreshToken.updateMany({
        where: { tokenHash, userId },
        data: { isRevoked: true, revokedAt: new Date() },
      });
    } else {
      // Revoke all tokens for user
      await this.prisma.refreshToken.updateMany({
        where: { userId, isRevoked: false },
        data: { isRevoked: true, revokedAt: new Date() },
      });
    }
    return { success: true };
  }

  private async generateTokens(
    userId: string,
    deviceInfo?: string,
    ip?: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) throw new UnauthorizedException();

    const roles = user.userRoles.map((ur) => ur.role.name);
    const permissions = Array.from(
      new Set(
        user.userRoles.flatMap((ur) =>
          ur.role.rolePermissions.map((rp) => rp.permission.slug),
        ),
      ),
    );

    const payload = {
      sub: user.id,
      email: user.email,
      phone: user.phone,
      roles,
      permissions,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("jwt.accessSecret"),
      expiresIn: this.configService.get<string>("jwt.accessExpiresIn", "15m"),
    });

    const rawRefreshToken = crypto.randomBytes(64).toString("hex");
    const refreshExpiresAt = new Date();
    refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: this.hashToken(rawRefreshToken),
        deviceInfo: deviceInfo || null,
        ipHash: ip
          ? crypto.createHash("sha256").update(ip).digest("hex")
          : null,
        expiresAt: refreshExpiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      expiresIn: 900, // 15 mins in seconds
    };
  }

  private async recordFailedAttempt(key: string) {
    const current = await this.redis.get(key);
    const count = current ? parseInt(current, 10) + 1 : 1;
    await this.redis.set(key, count.toString(), 15 * 60);
  }
}
