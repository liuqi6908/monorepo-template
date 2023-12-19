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
  /** 拥有该角色的用户列表 */
  users?: IUser[]
  /** 可访问的数据目录列表 */
  directories?: IDataDirectory[]
}
