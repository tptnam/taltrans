import type { SheetMapping, SheetColumn } from '../entities/translation'

export interface SeedUploadResponse {
  fileId: string
  sheets: string[]
}

export interface SeedColumnsRequest {
  fileId: string
  sheets: string[]
}

export interface SeedColumnsResponse {
  [sheetName: string]: SheetColumn[]
}

export interface SeedConfirmRequest {
  fileId: string
  mappings: SheetMapping[]
}

export interface SeedConfirmResponse {
  imported: number
}
