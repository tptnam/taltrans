import { Injectable } from '@nestjs/common'
import { AppAuthGuard } from '../app.auth.guard'

@Injectable()
export class AdminAuthGuard extends AppAuthGuard {
  protected override readonly expectedTokenType = 'ADMIN' as const
}
