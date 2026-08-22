import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorCode } from '../enums/error-code.enum';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const requestId = (request.headers['x-request-id'] as string) || 'unknown';
    const isProduction = process.env.NODE_ENV === 'production';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code: string = ErrorCode.INTERNAL_ERROR;
    let message = 'An unexpected internal error occurred';
    let details: any = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        message = res.message || exception.message;
        code = res.code || (status === 404 ? ErrorCode.RESOURCE_NOT_FOUND : (status === 400 ? ErrorCode.VALIDATION_ERROR : ErrorCode.INTERNAL_ERROR));
        details = res.details || (Array.isArray(res.message) ? res.message : undefined);
        if (Array.isArray(res.message)) {
          message = 'Validation failed';
          code = ErrorCode.VALIDATION_ERROR;
        }
      }
    } else if (exception instanceof Error) {
      // Non-HttpException error
      this.logger.error(
        `[${requestId}] Unhandled Exception: ${exception.message}`,
        exception.stack,
      );

      if (!isProduction) {
        message = exception.message;
        details = { stack: exception.stack };
      }
    }

    const errorResponse = {
      success: false,
      error: {
        code,
        message,
        ...(details ? { details } : {}),
      },
      requestId,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorResponse);
  }
}
