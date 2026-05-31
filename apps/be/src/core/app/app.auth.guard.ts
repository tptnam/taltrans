import {
  CanActivate,
  CustomDecorator,
  ExecutionContext,
  Injectable,
  Logger,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { AppRequestUser, RequestWithUser } from './app.request'

export const IS_ANONYMOUS = 'isAnonymous'
export const Anonymous = (): CustomDecorator => SetMetadata(IS_ANONYMOUS, true)

type TokenType = 'CLIENT' | 'ADMIN'

type TokenPayload = {
  sub?: string
  id?: string
  name?: string
  email?: string
  role?: string
  type?: TokenType
}

@Injectable()
export class AppAuthGuard implements CanActivate {
  protected readonly expectedTokenType?: TokenType
  private readonly logger = new Logger(AppAuthGuard.name)

  constructor(
    protected readonly jwtService: JwtService,
    protected readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>()

    if (this.isAnonymous(context)) {
      return true
    }

    const token = this.extractToken(request.headers.authorization)
    if (!token) {
      throw new UnauthorizedException('No token provided')
    }

    request.user = await this.verifyToken(token)
    return true
  }

  private extractToken(authHeader: string | undefined): string | undefined {
    if (!authHeader) return undefined

    const [type, token] = authHeader.split(' ') ?? []
    if (type !== 'Bearer') return undefined

    return token
  }

  private async verifyToken(token: string): Promise<AppRequestUser> {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(token)

      if (this.expectedTokenType && payload.type && payload.type !== this.expectedTokenType) {
        throw new UnauthorizedException('Invalid token type')
      }

      const id = payload.sub || payload.id
      if (!id) {
        throw new UnauthorizedException('Invalid token payload')
      }

      return {
        id,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        type: payload.type,
      }
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) throw error

      this.logger.error('JWT verification failed', error instanceof Error ? error.stack : undefined)
      throw new UnauthorizedException('Invalid token')
    }
  }

  private isAnonymous(context: ExecutionContext): boolean {
    const targets = [context.getHandler(), context.getClass()]
    return this.reflector.getAllAndOverride<boolean>(IS_ANONYMOUS, targets) || false
  }
}
