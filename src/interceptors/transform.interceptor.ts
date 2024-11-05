import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  HttpException,
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

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      timeout(5000),
      map((data) => ({ success: true, message: 'Success', data })),
      catchError((error) => {
        if (error instanceof ZodError) {
          return throwError(
            () =>
              new HttpException(
                {
                  success: false,
                  message: 'Request validation failed',
                  validation_error: error.format(),
                },
                400,
              ),
          );
        }
        if (error instanceof BadRequestException) {
          const responseMessage = error.message;
          return throwError(
            () =>
              new HttpException(
                {
                  success: false,
                  message: responseMessage,
                },
                400,
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
                400,
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
              500,
            ),
        );
      }),
    );
  }
}
