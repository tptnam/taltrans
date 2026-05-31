import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { AppRequestUser, RequestWithUser } from './app.request'

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AppRequestUser | undefined => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>()
    return request.user
  },
)
