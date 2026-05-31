import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'
import { ConfigService } from '@nestjs/config'

export const getCorsOptions = (configService: ConfigService): CorsOptions => {
  const origins = configService.get<string[]>('cors.origins') || []

  return {
    origin: origins.length > 0 ? origins : true,
    credentials: true,
  }
}
