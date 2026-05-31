import {
  ConsoleLogger,
  Injectable,
  LogLevel,
  LoggerService as NestLoggerService,
  Optional,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

const toLogLevels = (level: string): LogLevel[] => {
  switch (level) {
    case 'error':
      return ['error']
    case 'warn':
      return ['error', 'warn']
    case 'info':
      return ['error', 'warn', 'log']
    case 'debug':
      return ['error', 'warn', 'log', 'debug']
    default:
      return ['error', 'warn', 'log', 'debug', 'verbose']
  }
}

@Injectable()
export class LoggerService extends ConsoleLogger implements NestLoggerService {
  constructor(@Optional() configService?: ConfigService) {
    const level =
      configService?.get<string>('logging.level') ||
      (process.env.NODE_ENV === 'production' ? 'info' : 'debug')

    super('Taltrans', {
      logLevels: toLogLevels(level),
      timestamp: true,
    })
  }

  logSystem(level: string, message: unknown, meta?: { stack?: string; context?: string }): void {
    if (level === 'error') {
      this.error(message, meta?.stack, meta?.context)
      return
    }

    if (level === 'warn') {
      this.warn(message, meta?.context)
      return
    }

    if (level === 'debug') {
      this.debug(message, meta?.context)
      return
    }

    if (level === 'verbose') {
      this.verbose(message, meta?.context)
      return
    }

    this.log(message, meta?.context)
  }
}
