import { objectKeys } from '@catsjuice/utils'

import type { IRole } from '../entities/role.interface'
import type { IPermission } from '../entities/permission.interface'
import type { PermissionType } from './permission.enum'
import { permissionDescriptions } from './permission.enum'

const allPermissionNames = objectKeys(permissionDescriptions) as PermissionType[]

function getPermission(name: PermissionType): IPermission {
  return {
    name,
    description: permissionDescriptions[name],
  }
}

/**
 * 全部的默认权限
 */
export const defaultRoles: IRole[] = [
  {
    id: 'root',
    name: 'root',
    description: '管理后台全部功能的管理权限',
    permissions: allPermissionNames.map(pn => getPermission(pn)),
  },
]

/**
 * 默认权限的映射表
 */
export const defaultRolesMap = defaultRoles.reduce((map, role) => {
  map[role.name] = role
  return map
}, {} as Record<string, IRole>)
