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
          id: 'config',
          label: '全局配置',
          flag: role?.includes(PermissionType.CONFIG_QUERY_APP),
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
