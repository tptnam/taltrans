import {
  applyDecorators,
  HttpException,
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common'
import { Matches, ValidationError, ValidationOptions } from 'class-validator'

export {
  ArrayMinSize,
  IsAlpha,
  IsAlphanumeric,
  IsArray,
  IsBoolean,
  IsDate,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  Matches,
  Max,
  MaxDate,
  MaxLength,
  Min,
  MinDate,
  MinLength,
  ValidateIf,
} from 'class-validator'

export const Regex = {
  Email:
    /^[a-z0-9!#$%&'*+\\/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+\\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
  Phone: /^\d{10,11}$/,
  FullName: /^[A-Za-z\s]+$/,
  Password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,64}$/,
  Slug: /^[a-z0-9-/]+$/,
}

export const IsEmail = (
  pattern: RegExp = Regex.Email,
  validationOptions?: ValidationOptions,
): PropertyDecorator => applyDecorators(Matches(pattern, validationOptions))

export const IsPhone = (
  pattern: RegExp = Regex.Phone,
  validationOptions?: ValidationOptions,
): PropertyDecorator => applyDecorators(Matches(pattern, validationOptions))

export const IsFullName = (
  pattern: RegExp = Regex.FullName,
  validationOptions?: ValidationOptions,
): PropertyDecorator => applyDecorators(Matches(pattern, validationOptions))

export const IsPassword = (
  pattern: RegExp = Regex.Password,
  validationOptions?: ValidationOptions,
): PropertyDecorator => applyDecorators(Matches(pattern, validationOptions))

export class ValidationException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY)
  }
}

export const getValidatorPipe = (debugEnabled?: boolean): ValidationPipe => {
  return new ValidationPipe({
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    forbidNonWhitelisted: false,
    enableDebugMessages: debugEnabled || false,
    stopAtFirstError: true,
    exceptionFactory: (validationErrors: ValidationError[] = []) => {
      const error = validationErrors[0]

      if (error?.constraints) {
        return new ValidationException(error.constraints[Object.keys(error.constraints)[0]])
      }

      return new UnprocessableEntityException(error)
    },
  })
}
