/**
 * 全局搜索数据资源
 * 请求参数
 */
export interface IDataSearchBodyDto {
  /** 搜索层级（1-5，分别对应 数据库、子库、模块、表格、字段） */
  level: number

  /** 搜索关键词 */
  value: string
}
