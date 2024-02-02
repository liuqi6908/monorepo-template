import { hasIntersection, omit } from 'zjf-utils'

export function useRole() {
  /**
   * 管理后台用户菜单
   */
  const adminMenu = computed(() => {
    const { adminRole } = useUser()
    return ADMIN_MENU_LIST.filter(({ menu, flag }) => (
      hasIntersection(menu, adminRole.value ?? [])
      && flag !== false
    ))
      .map(v => omit(v, 'permission'))
  })

  return {
    adminMenu,
  }
}
