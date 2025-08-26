import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, { message: string; data: T }>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<{ message: string; data: T }> {
    return next.handle().pipe(
      map((data) => {
        return {
          message: 'Success',
          data,
        };
      }),
    );
  }
}
