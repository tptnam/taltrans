export interface AppBootstrapConfig {
  name?: string
  version?: string
  description?: string
  port?: number
  host?: string
  swagger?: {
    enabled?: boolean
    path?: string
    title?: string
    description?: string
    version?: string
    tags?: Array<{ name: string; description?: string }>
  }
  enableCors?: boolean
  enableValidation?: boolean
  enableShutdownHooks?: boolean
}
