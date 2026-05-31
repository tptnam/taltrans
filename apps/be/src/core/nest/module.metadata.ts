import { DynamicModule, Provider, Type } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import configuration from '../../config/configuration'
import { AppExceptionFilter } from '../app/app.exception-filter'
import { AppInterceptor } from '../app/app.interceptor'
import { PrismaModule } from '../database/prisma/prisma.module'
import { LoggingModule } from '../logging/logging.module'
import { getJwtConfig } from './jwt'

const forApp = (
  modules: (DynamicModule | Type<unknown>)[] = [],
): {
  imports: Array<DynamicModule | Promise<DynamicModule> | Type<unknown>>
  providers: Provider[]
} => {
  const imports: Array<DynamicModule | Promise<DynamicModule> | Type<unknown>> = [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env'],
    }),
    PrismaModule,
    JwtModule.registerAsync(getJwtConfig()),
    LoggingModule,
    ...modules,
  ]

  const providers: Provider[] = [
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AppInterceptor,
    },
  ]

  return { imports, providers }
}

const forModule = (
  controllers: Type<unknown>[] = [],
  handlers: Provider[] = [],
  repositories: Provider[] = [],
): {
  controllers: Type<unknown>[]
  imports: DynamicModule[]
  providers: Provider[]
} => ({
  controllers,
  imports: [],
  providers: [...handlers, ...repositories],
})

export const ModuleMetadata = { forApp, forModule }
