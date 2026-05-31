import { HttpException, HttpStatus } from '@nestjs/common'

export class CustomHttpException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    public code?: string,
    public details?: unknown,
  ) {
    super(message, status)
  }
}

export class NotFoundException extends CustomHttpException {
  constructor(message = 'Resource not found', code = 'NOT_FOUND') {
    super(message, HttpStatus.NOT_FOUND, code)
  }
}

export class BadRequestException extends CustomHttpException {
  constructor(message = 'Bad request', code = 'BAD_REQUEST', details?: unknown) {
    super(message, HttpStatus.BAD_REQUEST, code, details)
  }
}

export class UnauthorizedException extends CustomHttpException {
  constructor(message = 'Unauthorized', code = 'UNAUTHORIZED') {
    super(message, HttpStatus.UNAUTHORIZED, code)
  }
}

export class ForbiddenException extends CustomHttpException {
  constructor(message = 'Forbidden', code = 'FORBIDDEN') {
    super(message, HttpStatus.FORBIDDEN, code)
  }
}
