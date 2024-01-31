import { hasIntersection, omit } from 'zjf-utils'

export function useRole() {
  /**
   * 管理后台用户菜单
   */
  const adminMenu = computed(() => {
    const { adminRole } = useUser()
    return ADMIN_MENU_LIST.filter(({ name, menu }) => (
      ((name === '采购管理' && getEnvVariable('VITE_DATA_PRE_PURCHASE'))
        || (name === '作品管理' && getEnvVariable('VITE_WORKS_MANAGE'))
        || !['采购管理', '作品管理'].includes(name))
      && hasIntersection(menu, adminRole.value ?? [])
    )).map(v => omit(v, 'permission'))
  })

  return {
    adminMenu,
  }
}
