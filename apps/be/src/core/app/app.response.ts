export interface ApiResponse<T = unknown> {
  statusCode: number
  data: T
  message: string
}

export type AsyncApiResponse<T> = Promise<ApiResponse<T>>

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isApiResponse = (value: unknown): value is ApiResponse<unknown> =>
  isRecord(value) && 'statusCode' in value && 'data' in value && 'message' in value

export class ResponseFormatter {
  static success<T>(data: T, message = 'Success', statusCode = 200): ApiResponse<T> {
    return {
      statusCode,
      data,
      message,
    }
  }

  static error<T = null>(message: string, statusCode = 500, data: T = null as T): ApiResponse<T> {
    return {
      statusCode,
      data,
      message,
    }
  }

  static format<T>(data: T, statusCode = 200): ApiResponse<T> {
    if (isApiResponse(data)) {
      return data as ApiResponse<T>
    }

    if (isRecord(data) && data.success === false) {
      return {
        statusCode: typeof data.statusCode === 'number' ? data.statusCode : statusCode,
        data: (data.data ?? null) as T,
        message: typeof data.message === 'string' ? data.message : 'Error occurred',
      }
    }

    return {
      statusCode,
      data,
      message: statusCode >= 400 ? 'Error occurred' : 'Success',
    }
  }
}
