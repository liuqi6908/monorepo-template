import type { IDataField } from './data-field.interface'
import type { IDataRole } from './data-role.interface'

/**
 * 数据目录
 */
export interface IDataDirectory {
  /** 目录的唯一标识 */
  id: string
  /** 中文名称 */
  nameZH: string
  /** 英文名称 */
  nameEN: string
  /** 子目录列表 */
  children?: IDataDirectory[]
  /** 父目录 */
  parent?: IDataDirectory
  /** 父级目录的唯一标识 */
  parentId?: string
  /** 字段 */
  fields?: IDataField[]

  //  ------- 以下信息为了方便数据处理而添加的字段  -------  //
  /** 根目录的唯一标识（方便快速删除指定的大类） */
  rootId?: string
  /** 目录的层级 */
  level: number
  /** 排序 */
  order?: number
  /** 当前数据目录的路径 */
  path?: string[]

  /** 引用规范信息 */
  reference?: string
  /** 拥有查看权限的数据角色列表 */
  viewDataRoles?: IDataRole[]
  /** 拥有下载权限的数据角色列表 */
  downloadDataRoles?: IDataRole[]
}
