import { applyDecorators, Controller as NestController, UseGuards } from '@nestjs/common'
import { CustomDecorator } from '@nestjs/common'
import { Anonymous } from './app.auth.guard'
import { API_VERSIONING } from './app.versioning'
import { AdminAuthGuard } from './guards/admin-auth.guard'
import { ClientAuthGuard } from './guards/client-auth.guard'

export enum ClientType {
  Rest = 'REST',
  Admin = 'ADMIN',
}

interface RestOptions {
  type?: ClientType.Rest
  path?: string
  anonymous?: boolean
  version?: string
}

interface AdminOptions {
  type?: ClientType.Admin
  path?: string
  anonymous?: boolean
  version?: string
}

type Options = RestOptions | AdminOptions

const create =
  (type: ClientType, service: string, options?: Options): ClassDecorator =>
  (target) => {
    const resolvedOptions = { ...(options || {}), type }
    const decorators: (ClassDecorator | CustomDecorator)[] = []

    switch (resolvedOptions.type) {
      case ClientType.Rest: {
        const basePath = resolvedOptions.path || service
        const version = resolvedOptions.version || API_VERSIONING.defaultVersion
        const versionedPath = API_VERSIONING.enabled
          ? `api/${version}/${basePath}`.replace(/\/+/g, '/')
          : basePath

        decorators.push(NestController(versionedPath))
        decorators.push(UseGuards(ClientAuthGuard))
        if (resolvedOptions.anonymous) decorators.push(Anonymous())
        return applyDecorators(...decorators)(target)
      }

      case ClientType.Admin: {
        const basePath = resolvedOptions.path || service
        const version = resolvedOptions.version || API_VERSIONING.defaultVersion
        const versionedPath = API_VERSIONING.enabled
          ? `api/${version}/admin/${basePath}`.replace(/\/+/g, '/')
          : `admin/${basePath}`

        decorators.push(NestController(versionedPath))
        decorators.push(UseGuards(AdminAuthGuard))
        if (resolvedOptions.anonymous) decorators.push(Anonymous())
        return applyDecorators(...decorators)(target)
      }

      default:
        return applyDecorators(...decorators)(target)
    }
  }

export const Controller = {
  Rest: (service: string, options?: RestOptions): ClassDecorator =>
    create(ClientType.Rest, service, options),
  Admin: (service: string, options?: AdminOptions): ClassDecorator =>
    create(ClientType.Admin, service, options),
}
