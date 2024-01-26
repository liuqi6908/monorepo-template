import type { LogDataAction } from '../enum/log.enum'
import type { IUser } from './user.interface'

/**
 * 日志
 */
export interface ILog {
  /** 用户信息 */
  user?: Partial<IUser>
  /** 行为 */
  action: LogDataAction
  /** ip地址 */
  ip: string
  /** 状态码 */
  status: number
  /** 目标 */
  target: {
    /** 数据大类id */
    rootId?: string
    /** 数据大类中文名 */
    rootName?: string
    /** 数据库id */
    dbId?: string
    /** 数据库中文名 */
    dbName?: string
    /** 子库id */
    subDbId?: string
    /** 子库中文名 */
    subDbName?: string
    /** 模块id */
    moduleId?: string
    /** 模块中文名 */
    moduleName?: string
    /** 表格id */
    tableId?: string
    /** 表格中文名 */
    tableName?: string
  }
  time: Date
}
