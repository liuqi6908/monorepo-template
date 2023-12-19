import type { PermissionType } from 'zjf-types'
import { expandArray, hasIntersection } from '.'
import { MenuList } from '~/constants'

/**
 * 根据角色粒子化权限返回后台菜单
 */
export function rolePermissionsToLabel(permissions: PermissionType[] = []) {
  return MenuList.filter(v => hasIntersection(v.permission, permissions))
    .map(v => v.name)
}

/**
 * 根据后台菜单返回角色粒子化权限
 */
export function labelToRolePermissions(permissions: string[] = []) {
  return expandArray(MenuList.filter(v => permissions.includes(v.name))
    .map(v => v.permission))
}
