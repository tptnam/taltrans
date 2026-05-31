import { registerAs } from '@nestjs/config'

export interface AppConfig {
  port: number
  nodeEnv: string
}

export interface JwtConfig {
  secret: string
  algorithm: string
  expiresIn?: string
  issuer?: string
}

export interface LoggingConfig {
  level: string
}

export interface ValidationConfig {
  debugEnabled: boolean
}

export interface CorsConfig {
  origins: string[]
}

export const appConfig = registerAs(
  'app',
  (): AppConfig => ({
    port: parseInt(process.env.PORT || '3001', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
  }),
)

export const jwtConfig = registerAs(
  'jwt',
  (): JwtConfig => ({
    secret: process.env.APP_JWT_SECRET || 'change-me',
    algorithm: process.env.APP_JWT_ALGORITHM || 'HS256',
    expiresIn: process.env.APP_JWT_EXPIRES_IN || '3d',
    issuer: process.env.APP_JWT_ISSUER,
  }),
)

export const loggingConfig = registerAs(
  'logging',
  (): LoggingConfig => ({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  }),
)

export const validationConfig = registerAs(
  'validation',
  (): ValidationConfig => ({
    debugEnabled: process.env.VALIDATOR_DEBUG_ENABLED === 'true',
  }),
)

export const corsConfig = registerAs(
  'cors',
  (): CorsConfig => ({
    origins: (process.env.CORS_ORIGINS || '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  }),
)

export default () => ({
  app: appConfig(),
  jwt: jwtConfig(),
  logging: loggingConfig(),
  validation: validationConfig(),
  cors: corsConfig(),
})
