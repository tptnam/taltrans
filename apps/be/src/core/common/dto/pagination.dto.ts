import { IsNumber, IsOptional, Min } from '../../plugins/validator'

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  page = 1

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit = 10

  @IsOptional()
  sortBy = 'createdAt'

  @IsOptional()
  sortOrder: 'ASC' | 'DESC' = 'DESC'
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResult<T> {
  items: T[]
  meta: PaginationMeta
}

export function paginate<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / limit)

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
}
