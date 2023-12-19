import type { IPermission } from './permission.interface'

/**
 * 业务角色
 * 可自由 创建/删除 角色
 */
export interface IRole {
  /** 业务角色的唯一标识 */
  id: string
  /** 角色名称 */
  name: string
  /** 角色描述 */
  description?: string
  /** 权限列表 */
  permissions?: IPermission[]
}
