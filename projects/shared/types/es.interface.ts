enum EsFieldType {
  TEXT = 'text',
  KEYWORD = 'keyword',
  DOUBLE = 'double',
  DATE = 'date',
  GEO_POINT = 'geo_point',
  INTEGER = 'integer',
  NESTED = 'nested',
  BOOLEAN = 'boolean',
}

type EsFieldTypes =
  | 'date'
  | 'text'
  | 'keyword'
  | 'double'
  | 'geo_point'
  | 'integer'
  | 'nested'

interface EsProperty {
  type: EsFieldType | EsFieldTypes
  index?: boolean
  ignore_above?: number
  format?: string
  fields?: Record<string, EsProperty>
  properties?: Record<string, EsProperty>
}

/**
 * 日志索引 mapping 信息
 */
export interface EsMapping<K extends string = string> {
  properties: Record<K, EsProperty>
}
