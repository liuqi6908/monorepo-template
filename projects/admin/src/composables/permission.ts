import { hasIntersection } from 'zjf-utils'
import type { PermissionType } from 'zjf-types'
import type { PermissionItem } from '~/constants/admin'

export function usePermission() {
  /**
   * 管理后台用户菜单
   */
  const adminMenu = computed(() => {
    const { adminRole } = useUser()
    return ADMIN_MENU_LIST.filter(({ name }) => (
      hasIntersection(getMenuAllPermission(name), adminRole.value ?? [])
    )).map(({ name, to }) => ({ name, to }))
  })

  /**
   * 获取菜单中的所有权限
   */
  function getMenuAllPermission(name: string) {
    const permission: PermissionType[] = []

    function traverse(item: PermissionItem) {
      if (item.value)
        permission.push(...item.value)

      if (item.children)
        item.children.forEach(traverse)
    }

    const menu = ADMIN_MENU_LIST.find(v => v.name === name)
    menu?.permission.forEach(traverse)

    return [...new Set(permission)]
  }

  return {
    adminMenu,
    getMenuAllPermission,
  }
}
