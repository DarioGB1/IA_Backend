import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RpcException } from '@nestjs/microservices';
import { AppException } from '../interfaces';

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((e: Record<string, any>) => {
        if ('status' in e && 'response' in e && 'options' in e) {
          const error = e as AppException;
          return throwError(
            () =>
              new RpcException({
                status: error.status,
                response: {
                  error: error.response.error,
                  message: error.response.message,
                  statusCode: error.response.statusCode,
                },
                options: error.options,
              }),
          );
        }
        const error = e as Record<string, unknown>;
        return throwError(
          () =>
            new RpcException({
              status: 500,
              response: {
                error: 'Internal Server Error',
                message:
                  'An unexpected error occurred on the server. We are working to resolve it',
                statusCode: 500,
              },
              options: {
                message: error?.message ?? 'Internal server error',
                stack: error?.stack,
              },
            }),
        );
      }),
    );
  }
}
