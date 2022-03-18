import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ApiResponse } from '../ApiResponse'

export interface Response<T> {
    data: T
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        return next.handle().pipe(
            map((data) => {
                if (data instanceof ApiResponse) {
                    if (data.status) {
                        context.switchToHttp().getResponse().status(data.status)
                    }
                    // Omit body if status is 204 or 202
                    if (data.status === 202 || data.status === 204) return
                    return data
                }
                return { data, message: 'OK' }
            })
        )
    }
}
