import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RoleType } from "@prisma/client";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { ErrorCode } from "../enums/error-code.enum";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.roles) {
      throw new ForbiddenException({
        code: ErrorCode.AUTH_FORBIDDEN,
        message: "Access denied: insufficient permissions",
      });
    }

    // SUPER_ADMIN has access to all roles
    if (user.roles.includes(RoleType.SUPER_ADMIN)) {
      return true;
    }

    const hasRole = requiredRoles.some((role) => user.roles.includes(role));
    if (!hasRole) {
      throw new ForbiddenException({
        code: ErrorCode.AUTH_FORBIDDEN,
        message: `Access denied: requires one of [${requiredRoles.join(", ")}]`,
      });
    }

    return true;
  }
}
