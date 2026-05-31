export {
  BadRequestException as BadRequest,
  ForbiddenException as Forbidden,
  HttpException as Http,
  HttpVersionNotSupportedException as HttpVersionNotSupported,
  InternalServerErrorException as InternalServerError,
  NotFoundException as NotFound,
  NotImplementedException as NotImplemented,
  RequestTimeoutException as RequestTimeout,
  ServiceUnavailableException as ServiceUnavailable,
  UnauthorizedException as Unauthorized,
} from '@nestjs/common'

import { BadRequestException } from '@nestjs/common'

export interface ExceptionError {
  statusCode: number
  error: string
  message: string
  errorCode: string
}

export class BadRequestWithCode extends BadRequestException {
  constructor(message = 'An error occurred', errorCode = 'BAD_REQUEST') {
    const error: ExceptionError = {
      statusCode: 400,
      error: 'Bad Request',
      message,
      errorCode,
    }
    super(error)
  }
}
