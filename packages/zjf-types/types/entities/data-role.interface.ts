import type { IDataDirectory } from './data-directory.interface'
import type { IUser } from './user.interface'

/**
 * 数据下载角色
 * 区分于 IRole，仅针对数据下载，IRole 为业务角色
 */
export interface IDataRole {
  /** 数据下载角色的唯一标识 */
  id: string
  /** 角色名称 */
  name: string
  /** 角色描述 */
  description?: string
  /** 是否可选 */
  select?: boolean
  /** 排序 */
  sort?: number
  /** 拥有该角色的用户列表 */
  users?: IUser[]
  /** 可浏览的数据目录 */
  viewDirectories?: IDataDirectory[]
  /** 可下载的数据目录 */
  downloadDirectories?: IDataDirectory[]
}
