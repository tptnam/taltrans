import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { LoggerService } from '../logger.service'

type TimedRequest = Request & {
  startTime?: number
}

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: TimedRequest, _res: Response, next: NextFunction): void {
    req.startTime = Date.now()
    this.logger.log(`Executing ${req.method} ${req.originalUrl || req.url || '/'}`, 'HTTP')
    next()
  }
}
