import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name)
  private readonly hasDatabaseUrl: boolean

  constructor() {
    const connectionString =
      process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/taltrans'

    super({
      adapter: new PrismaPg({ connectionString }),
    })

    this.hasDatabaseUrl = Boolean(process.env.DATABASE_URL)
  }

  async onModuleInit(): Promise<void> {
    if (!this.hasDatabaseUrl) {
      this.logger.warn('DATABASE_URL is not set. Skipping database connection on bootstrap.')
      return
    }

    const maxRetries = 5

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.$connect()
        this.logger.log('Database connected successfully')
        return
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error)
        this.logger.warn(`Database connection attempt ${attempt}/${maxRetries} failed: ${message}`)

        if (attempt === maxRetries) {
          this.logger.error('Failed to connect to database after max retries')
          throw error
        }

        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.$disconnect()
      this.logger.log('Database disconnected successfully')
    } catch (error: unknown) {
      this.logger.error(
        'Error disconnecting from database',
        error instanceof Error ? error.stack : undefined,
      )
    }
  }
}
