import type { LogDimensionId } from '../../enum/log.enum'

/**
 * 日志聚合分析
 * 请求参数
 */
export interface IAggLogBodyDto {
  /** 查询语句 */
  dsl?: string
  /** 聚合维度 */
  dimension: LogDimensionId
  /** 最多取多少条 */
  size?: number
}
