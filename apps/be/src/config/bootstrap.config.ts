import { AppBootstrapConfig } from '../core/app'

export const bootstrapConfig: AppBootstrapConfig = {
  name: 'Taltrans API',
  version: '1.0',
  description: 'Taltrans backend API documentation',
  swagger: {
    enabled: true,
    path: 'api/docs',
    tags: [{ name: 'health', description: 'Application health endpoints' }],
  },
  enableCors: true,
  enableValidation: true,
  enableShutdownHooks: true,
}

export const getBootstrapConfig = (): AppBootstrapConfig => {
  const env = process.env.NODE_ENV || 'development'
  const port = parseInt(process.env.PORT || '3001', 10)
  const baseConfig = { ...bootstrapConfig, port }

  if (env === 'production' || env === 'staging') {
    return {
      ...baseConfig,
      swagger: {
        ...baseConfig.swagger,
        enabled: false,
      },
    }
  }

  return baseConfig
}
