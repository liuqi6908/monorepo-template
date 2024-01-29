import type { ILog } from '../../entities/log.interface'

/**
 * 日志原始数据查询
 * 请求参数
 */
export interface IQueryByDslBodyDto {
  /** 查询语句 */
  dsl?: string
  /** 当前页码 */
  page?: number
  /** 每页显示的数量 */
  pageSize?: number
  /** 过滤返回数据的字段，如果不指定，则返回全部的字段 */
  fields?: string[]
  /** 根据日志记录时间排序，默认降序排序 */
  sort?: 'DESC' | 'ASC'
}

/**
 * 日志原始数据查询
 * 响应数据
 */
export interface IQueryByDslReqResData {
  /** 查询的日志总数 */
  total: {
    value: number
  }
  /** 当前页码 */
  page: number
  /** 每页显示的数量 */
  pageSize: number
  /** 页码总数 */
  pages: number
  /** 查询的日志记录 */
  records: ILog[]
}
