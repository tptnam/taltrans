import { Injectable } from '@nestjs/common'
import { AppAuthGuard } from '../app.auth.guard'

@Injectable()
export class ClientAuthGuard extends AppAuthGuard {
  protected override readonly expectedTokenType = 'CLIENT' as const
}
