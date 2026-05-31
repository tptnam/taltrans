import { AppModule } from './app.module'
import { ApplicationBootstrap } from './core/app'
import { getBootstrapConfig } from './config/bootstrap.config'

async function bootstrap() {
  const app = new ApplicationBootstrap(AppModule, getBootstrapConfig())
  await app.start()
}

bootstrap().catch((error: unknown) => {
  console.error('Failed to start application:', error)
  process.exit(1)
})
