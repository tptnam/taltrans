import { classToPlain, plainToClass, Transform } from 'class-transformer'

export { Exclude, Expose, Transform, Type, classToPlain, plainToClass } from 'class-transformer'
export type { ClassTransformOptions, TransformOptions } from 'class-transformer'

type TransformValue<T> = {
  value: T
}

export const TransformUtils = {
  toISOString: ({ value }: TransformValue<Date>) => value?.toISOString(),
  toTimestamp: ({ value }: TransformValue<Date>) => value?.getTime(),
  toLowerCase: ({ value }: TransformValue<string>) => value?.toLowerCase(),
  toUpperCase: ({ value }: TransformValue<string>) => value?.toUpperCase(),
  toBoolean: ({ value }: TransformValue<unknown>) => {
    if (typeof value === 'boolean') return value
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true' || value === '1'
    }
    return Boolean(value)
  },
  toNumber: ({ value }: TransformValue<unknown>) => {
    if (typeof value === 'number') return value

    const num = Number(value)
    return Number.isNaN(num) ? undefined : num
  },
  trim: ({ value }: TransformValue<string>) => value?.trim(),
}

export const ToISOString = (): PropertyDecorator => Transform(TransformUtils.toISOString)
export const ToTimestamp = (): PropertyDecorator => Transform(TransformUtils.toTimestamp)
export const ToLowerCase = (): PropertyDecorator => Transform(TransformUtils.toLowerCase)
export const ToUpperCase = (): PropertyDecorator => Transform(TransformUtils.toUpperCase)
export const ToBoolean = (): PropertyDecorator => Transform(TransformUtils.toBoolean)
export const ToNumber = (): PropertyDecorator => Transform(TransformUtils.toNumber)
export const Trim = (): PropertyDecorator => Transform(TransformUtils.trim)

export class ResponseTransformer {
  static toResponse<T>(cls: new (...args: never[]) => T, data: unknown): T {
    return plainToClass(cls, data, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    })
  }

  static toResponseArray<T>(cls: new (...args: never[]) => T, data: unknown[]): T[] {
    return data.map((item) => this.toResponse(cls, item))
  }

  static toPlain<T>(instance: T): unknown {
    return classToPlain(instance, {
      excludeExtraneousValues: true,
    })
  }
}
