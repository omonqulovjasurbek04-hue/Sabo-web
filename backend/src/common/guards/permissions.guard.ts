import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RoleType } from "@prisma/client";
import { PERMISSIONS_KEY } from "../decorators/permissions.decorator";
import { ErrorCode } from "../enums/error-code.enum";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException({
        code: ErrorCode.AUTH_FORBIDDEN,
        message: "Access denied: unauthenticated",
      });
    }

    // SUPER_ADMIN bypasses granular permission check
    if (user.roles && user.roles.includes(RoleType.SUPER_ADMIN)) {
      return true;
    }

    const userPermissions: string[] = user.permissions || [];
    const hasAllPermissions = requiredPermissions.every((perm) =>
      userPermissions.includes(perm),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException({
        code: ErrorCode.AUTH_FORBIDDEN,
        message: `Access denied: missing required permissions [${requiredPermissions.join(", ")}]`,
      });
    }

    return true;
  }
}
