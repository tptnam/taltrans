import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Request, Response } from 'express'
import { Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { LoggerService } from '../logging/logger.service'
import { ResponseFormatter } from './app.response'

type TimedRequest = Request & {
  startTime?: number
}

@Injectable()
export class AppInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> {
    const ctx = context.switchToHttp()
    const request = ctx.getRequest<TimedRequest>()
    const response = ctx.getResponse<Response>()

    const startTime = request.startTime || Date.now()
    const url = request.originalUrl || request.url || '/'
    const method = request.method

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - startTime
        this.logger.log(
          `Executed ${method} ${url} - ${response.statusCode} - ${responseTime}ms`,
          'HTTP',
        )
      }),
      map((data: unknown) => ResponseFormatter.format(data, response.statusCode)),
    )
  }
}
