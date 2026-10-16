import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { RAW_RESPONSE_KEY } from "../decorators/raw-response.decorator";

export interface StandardResponse<T> {
  success: boolean;
  data: T;
  meta?: Record<string, any>;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  StandardResponse<T>
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardResponse<T>> {
    const isRaw = this.reflector.getAllAndOverride<boolean>(RAW_RESPONSE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isRaw) {
      return next.handle();
    }

    return next.handle().pipe(
      map((result) => {
        // If response is already in standard shape or stream/buffer, return as is
        if (
          result &&
          typeof result === "object" &&
          "success" in result &&
          "data" in result
        ) {
          return result;
        }

        // If result has data and meta (e.g. paginated result)
        if (
          result &&
          typeof result === "object" &&
          "data" in result &&
          "meta" in result
        ) {
          return {
            success: true,
            data: result.data,
            meta: result.meta,
          };
        }

        return {
          success: true,
          data: result,
        };
      }),
    );
  }
}
