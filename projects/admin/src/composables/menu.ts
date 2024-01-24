import { PermissionType } from 'zjf-types'
import { omit } from 'zjf-utils'

interface MenuItem {
  id: string
  label: string
  flag?: boolean
}

const { adminRole } = useUser()

/** 当前激活菜单 */
const active = ref<string>()
/** 是否已经对 menu 进行监听 */
let isWatch = false

export function useMenu() {
  const $route = useRoute()

  /** 菜单 */
  const menu = computed<MenuItem[] | undefined>(() => {
    const role = adminRole.value
    const menu: Record<string, MenuItem[]> = {
      home: [
        ...CMS_CONFIG.map(v => ({
          ...omit(v, 'component'),
          flag: v.id !== 'homeExpand' || getEnvVariable('VITE_HOME_EXPAND', false),
        })),
        {
          id: 'globalConfig',
          label: '全局配置',
          flag: role?.includes(PermissionType.CONFIG_QUERY_APP),
        },
      ],
      export: [
        {
          id: 'exportAudit',
          label: '大文件外发待审核',
          flag: role?.includes(PermissionType.EXPORT_LG_QUERY_PENDING),
        },
        {
          id: 'largeRecord',
          label: '大文件外发审核记录',
          flag: role?.includes(PermissionType.EXPORT_LG_QUERY_ALL),
        },
        {
          id: 'smallRecord',
          label: '小文件自动外发记录',
          flag: role?.includes(PermissionType.EXPORT_SM_QUERY_ALL),
        },
        {
          id: 'exportConfig',
          label: '外发配置管理',
          flag: role?.includes(PermissionType.CONFIG_QUERY_EXPORT),
        },
      ],
    }
    return menu[$route.path.substring(1)]?.filter(v => v.flag)
  })

  if (!isWatch) {
    isWatch = true
    watch(
      menu,
      (newVal) => {
        if (newVal?.length) {
          if (!newVal.find(v => v.id === active.value))
            active.value = newVal[0].id
        }
        else {
          active.value = undefined
        }
      },
      {
        immediate: true,
      },
    )
  }

  return {
    active,
    menu,
  }
}
