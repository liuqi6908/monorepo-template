import type {
  IAggLogBodyDto,
  IDailyCount,
  IQueryByDslBodyDto,
  IQueryByDslReqResData,
  LogDataAction,
  LogTarget,
} from 'zjf-types'
import type { EsMapping } from '../types/es.interface'
import type { LogItem } from '../types/log.interface'
import { useRequest } from '../composables/request'

const { $get, $post } = useRequest()

/**
 * 获取当前的日志索引 mapping 信息
 */
export function getLogMappingApi() {
  return $get<EsMapping>('/log/data/_mapping')
}

/**
 * 获取全部的可用行为
 */
export function getLogActionsApi() {
  return $get<LogItem<LogDataAction>[]>('/log/data/_actions')
}

/**
 * 获取全部的操作对象
 */
export function getLogTargetsApi() {
  return $get<LogItem<LogTarget>[]>('/log/data/_targets')
}

/**
 * 代理查询 ElasticSearch
 */
export function proxyQueryEsApi(body: any) {
  return $post('/log/data/_proxy', body)
}

/**
 * 日志原始数据查询
 */
export function queryLogByDslApi(body: IQueryByDslBodyDto) {
  return $post<IQueryByDslReqResData>('/log/data/query/dsl', body)
}

/**
 * 日志聚合分析
 */
export function logClusterAnalysisApi(body: IAggLogBodyDto) {
  return $post<LogItem<string, number>>('/log/data/agg', body)
}

/**
 * 获取最近 7 天的访问量
 */
export function getAccessLast7DaysApi() {
  return $get<IDailyCount[]>('/log/access/last7days')
}

/**
 * 获取当日的访问量
 */
export function getAccessTodayApi() {
  return $get<number>('/log/access/today')
}

/**
 * 获取访问总量
 */
export function getAccessTotalApi() {
  return $get<number>('/log/access/total')
}
