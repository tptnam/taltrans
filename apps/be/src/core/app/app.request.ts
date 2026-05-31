import { Request } from 'express'

export type AppRequestUser = {
  id: string
  name?: string
  email?: string
  role?: string
  type?: 'CLIENT' | 'ADMIN'
}

export type RequestWithUser = Request & {
  user?: AppRequestUser
}
