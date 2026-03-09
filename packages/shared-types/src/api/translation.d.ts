import type { Translation, TranslationSource } from '../entities/translation'

export interface GetTranslationsQuery {
  search?: string
  source?: TranslationSource
  page?: number
  limit?: number
}

export interface GetTranslationsResponse {
  data: Translation[]
  total: number
}

export interface CreateTranslationRequest {
  zh: string
  en: string
}

export interface UpdateTranslationRequest {
  zh?: string
  en?: string
}
