import type { SheetMapping, SheetColumn, TranslatedSheet } from '../entities/translation'

export interface TranslateUploadResponse {
  fileId: string
  sheets: string[]
}

export interface TranslateColumnsRequest {
  fileId: string
  sheets: string[]
}

export interface TranslateColumnsResponse {
  [sheetName: string]: SheetColumn[]
}

export interface TranslateProcessRequest {
  fileId: string
  mappings: SheetMapping[]
}

export interface TranslateProcessResponse {
  sheets: TranslatedSheet[]
}

export interface TranslateAcceptRequest {
  fileId: string
  sheets: TranslatedSheet[]
}

export interface TranslateAcceptResponse {
  saved: number
}
