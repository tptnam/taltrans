import { INestApplication, Type } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppBootstrapConfig } from './bootstrap.interface'
import { getCorsOptions } from './app.cors'
import { LoggerService } from '../logging/logger.service'
import { getValidatorPipe } from '../plugins/validator'

export class ApplicationBootstrap {
  private app!: INestApplication
  private configService!: ConfigService

  constructor(
    private readonly appModule: Type<unknown>,
    private readonly config: AppBootstrapConfig = {},
  ) {}

  async start(): Promise<INestApplication> {
    await this.createApp()
    this.setupFeatures()
    await this.startServer()
    this.setupShutdown()

    return this.app
  }

  private async createApp(): Promise<void> {
    const logger = new LoggerService()

    this.app = await NestFactory.create(this.appModule, {
      logger,
    })

    this.configService = this.app.get(ConfigService)

    if (this.config.enableShutdownHooks !== false) {
      this.app.enableShutdownHooks()
    }
  }

  private setupFeatures(): void {
    if (this.config.enableCors !== false) {
      this.app.enableCors(getCorsOptions(this.configService))
    }

    if (this.config.enableValidation !== false) {
      const debugEnabled = this.configService.get<boolean>('validation.debugEnabled')
      this.app.useGlobalPipes(getValidatorPipe(debugEnabled))
    }

    if (this.config.swagger?.enabled !== false) {
      this.setupSwagger()
    }
  }

  private setupSwagger(): void {
    const swagger = this.config.swagger || {}

    const builder = new DocumentBuilder()
      .setTitle(swagger.title || this.config.name || 'Taltrans API')
      .setDescription(swagger.description || this.config.description || 'API Documentation')
      .setVersion(swagger.version || this.config.version || '1.0')
      .addBearerAuth()

    if (swagger.tags) {
      swagger.tags.forEach((tag) => {
        builder.addTag(tag.name, tag.description)
      })
    }

    const document = SwaggerModule.createDocument(this.app, builder.build())
    SwaggerModule.setup(swagger.path || 'api/docs', this.app, document)
  }

  private async startServer(): Promise<void> {
    const port = this.getPort()
    const host = this.config.host || '0.0.0.0'

    await this.app.listen(port, host)
    console.log(`Application running on http://${host}:${port}`)

    if (this.config.swagger?.enabled !== false) {
      console.log(
        `Swagger docs available at http://localhost:${port}/${this.config.swagger?.path || 'api/docs'}`,
      )
    }
  }

  private getPort(): number {
    if (this.config.port) return this.config.port

    const configPort = this.configService.get<number>('app.port')
    if (configPort) return configPort

    return parseInt(process.env.PORT || '3001', 10)
  }

  private setupShutdown(): void {
    const shutdown = async (signal: string) => {
      console.log(`Received ${signal}. Shutting down...`)

      try {
        await this.app.close()
        process.exit(0)
      } catch (error: unknown) {
        console.error('Error during shutdown:', error)
        process.exit(1)
      }
    }

    process.on('SIGTERM', () => {
      void shutdown('SIGTERM')
    })

    process.on('SIGINT', () => {
      void shutdown('SIGINT')
    })
  }

  getApp(): INestApplication {
    return this.app
  }
}
