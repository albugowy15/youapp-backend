import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  HttpException,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { ZodError } from 'zod';

export interface Response<T> {
  success: boolean;
  message: string;
  validation_error?: unknown;
  data?: T | null;
}

export class AppException extends HttpException {
  constructor(message: string, status: number) {
    super(message, status);
  }
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      timeout(5000),
      map((data) => ({ success: true, message: 'Success', data })),
      catchError((error) => {
        if (error instanceof AppException) {
          return throwError(
            () =>
              new HttpException(
                {
                  success: false,
                  message: error.message,
                },
                error.getStatus(),
              ),
          );
        }
        if (error instanceof ZodError) {
          return throwError(
            () =>
              new HttpException(
                {
                  success: false,
                  message: 'Request validation failed',
                  validation_error: error.format(),
                },
                HttpStatus.BAD_REQUEST,
              ),
          );
        }
        if (error instanceof UnauthorizedException) {
          return throwError(
            () =>
              new HttpException(
                {
                  success: false,
                  message: 'Unauthorized',
                },
                HttpStatus.UNAUTHORIZED,
              ),
          );
        }
        if (error instanceof BadRequestException) {
          return throwError(
            () =>
              new HttpException(
                {
                  success: false,
                  message: error.message,
                },
                HttpStatus.BAD_REQUEST,
              ),
          );
        }
        if (error instanceof TimeoutError) {
          return throwError(
            () =>
              new HttpException(
                {
                  success: false,
                  message: 'Request timeout',
                },
                HttpStatus.REQUEST_TIMEOUT,
              ),
          );
        }
        console.error('unknown error:', error);
        return throwError(
          () =>
            new HttpException(
              {
                success: false,
                message: 'Something went wrong',
              },
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
        );
      }),
    );
  }
}
