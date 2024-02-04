import { hasIntersection, omit } from 'zjf-utils'
import type { PermissionType } from 'zjf-types'

export function useRole() {
  /**
   * 管理后台用户菜单
   */
  const adminMenu = computed(() => {
    const { adminRole } = useUser()
    return getMenu(adminRole.value)
  })

  /**
   * 获取当前权限对应的菜单
   */
  function getMenu(permission?: PermissionType[]) {
    return ADMIN_MENU_LIST.filter(({ menu, flag }) => (
      hasIntersection(menu, permission ?? [])
      && flag !== false
    ))
      .map(v => omit(v, 'permission'))
  }

  return {
    adminMenu,
    getMenu,
  }
}
