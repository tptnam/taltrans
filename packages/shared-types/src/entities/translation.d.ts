import type { TranslationSource, CellStatus } from '../enums'

export interface Translation {
  id: string
  zh: string
  en: string
  source: TranslationSource
  createdAt: string
  updatedAt: string
}

export interface SheetColumn {
  index: number
  name: string
}

export interface MappingPair {
  zh: number
  en?: number
}

export interface SheetMapping {
  sheet: string
  pairs: MappingPair[]
}

export interface TranslatedCell {
  zh: string
  en: string
  status: CellStatus
  columnIndex: number
}

export interface TranslatedRow {
  rowIndex: number
  cells: TranslatedCell[]
}

export interface TranslatedSheet {
  sheet: string
  rows: TranslatedRow[]
}
