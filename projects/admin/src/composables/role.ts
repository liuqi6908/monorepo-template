import { hasIntersection, omit } from 'zjf-utils'
import type { IDataDirectory } from 'zjf-types'

/** 数据资源列表（用户权限管理） */
const dataList = ref<IDataDirectory[]>()

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

  /** 获取所有数据资源列表 */
  async function getAllDataList() {
    dataList.value = await getAllDataListApi()
    return dataList.value
  }

  return {
    dataList,
    adminMenu,
    getAllDataList,
  }
}
