import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ErrorCode } from '../enums/error-code.enum';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => (target: object, key?: any, descriptor?: any) => {
  Reflector.createDecorator<boolean>()(true)(target, key, descriptor);
};

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException({
          code: ErrorCode.AUTH_UNAUTHORIZED,
          message: info?.message || 'Unauthorized access',
        })
      );
    }
    return user;
  }
}
