import { ConfigService } from '@nestjs/config'
import { JwtModuleAsyncOptions, JwtSignOptions } from '@nestjs/jwt'
export { JwtService as Service } from '@nestjs/jwt'

export type JwtAlgorithm =
  | 'HS256'
  | 'HS384'
  | 'HS512'
  | 'RS256'
  | 'RS384'
  | 'RS512'
  | 'ES256'
  | 'ES384'
  | 'ES512'

export interface Payload {
  payload: {
    sub: string
    name?: string
    email?: string
    role?: string
    type?: 'CLIENT' | 'ADMIN'
  }
}

type JwtExpiresIn = NonNullable<JwtSignOptions['expiresIn']>

export const getJwtConfig = (): JwtModuleAsyncOptions => ({
  global: true,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const issuer = configService.get<string>('jwt.issuer')

    return {
      secret: configService.get<string>('jwt.secret'),
      signOptions: {
        algorithm: configService.get<JwtAlgorithm>('jwt.algorithm') || 'HS256',
        expiresIn: (configService.get<string>('jwt.expiresIn') || '3d') as JwtExpiresIn,
        ...(issuer ? { issuer } : {}),
      },
    }
  },
})

export const signOptions = (configService: ConfigService, expiresIn?: string): JwtSignOptions => ({
  expiresIn: (expiresIn || configService.get<string>('jwt.expiresIn') || '3d') as JwtExpiresIn,
  secret: configService.get<string>('jwt.secret'),
  algorithm: configService.get<JwtAlgorithm>('jwt.algorithm') || 'HS256',
})
