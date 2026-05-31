import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { LoggerService } from '../logging/logger.service'
import { ResponseFormatter } from './app.response'

type TimedRequest = Request & {
  startTime?: number
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(error: unknown, host: ArgumentsHost): void {
    const normalizedError = error instanceof Error ? error : new Error(String(error))
    Logger.error(normalizedError.message, normalizedError.stack, AppExceptionFilter.name)

    const ctx = host.switchToHttp()
    const request = ctx.getRequest<TimedRequest>()
    const response = ctx.getResponse<Response>()
    const status =
      error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    const url = request.originalUrl || request.url || '/'
    const method = request.method
    const responseTime = Date.now() - (request.startTime || Date.now())
    this.logger.log(`Executed ${method} ${url} - ${status} - ${responseTime}ms`, 'HTTP')

    const errorResponse = ResponseFormatter.error(
      this.getErrorMessage(error, normalizedError),
      status,
      this.getErrorData(error),
    )

    response.status(status).send(errorResponse)
  }

  private getErrorMessage(error: unknown, fallback: Error): string {
    if (error instanceof HttpException) {
      const exceptionResponse = error.getResponse()

      if (isRecord(exceptionResponse)) {
        const message = exceptionResponse.message
        if (Array.isArray(message)) return message.join(', ')
        if (typeof message === 'string') return message
      }

      if (typeof exceptionResponse === 'string') return exceptionResponse
    }

    return fallback.message || 'Internal server error'
  }

  private getErrorData(error: unknown): unknown {
    if (!(error instanceof HttpException)) return null

    const exceptionResponse = error.getResponse()
    if (!isRecord(exceptionResponse)) return null

    if ('data' in exceptionResponse) return exceptionResponse.data
    if ('errors' in exceptionResponse) return { errors: exceptionResponse.errors }

    return null
  }
}
