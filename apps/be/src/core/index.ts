import * as App from './app'
import * as CommonDecorators from './common/decorators'
import * as CommonDto from './common/dto'
import * as CommonExceptions from './common/exceptions'
import * as CommonMappers from './common/mappers'
import * as Database from './database/prisma'
import * as Logging from './logging'
import * as NestDecorators from './nest/decorators'
import * as NestException from './nest/exception'
import * as NestJwt from './nest/jwt'
import * as CommonNest from './nest/common'
import { ModuleMetadata } from './nest'
import * as PluginTransformer from './plugins/transformer'
import * as PluginValidator from './plugins/validator'

const Core = {
  App,
  Common: {
    Decorators: CommonDecorators,
    Dto: CommonDto,
    Exceptions: CommonExceptions,
    BaseMapper: CommonMappers.BaseMapper,
  },
  Database,
  Logging,
  Nest: {
    Common: CommonNest,
    Decorators: NestDecorators,
    Exception: NestException,
    Jwt: NestJwt,
    ModuleMetadata,
  },
  Plugins: {
    Transformer: PluginTransformer,
    Validator: PluginValidator,
  },
}

export default Core
