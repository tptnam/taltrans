import { MiddlewareConsumer, NestModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import Core from './core'

const appMetadata = Core.Nest.ModuleMetadata.forApp()

@Core.Nest.Decorators.Module({
  ...appMetadata,
  controllers: [AppController],
  providers: [...appMetadata.providers, AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Core.Logging.LoggingMiddleware).forRoutes('*')
  }
}
