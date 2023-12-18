import { computed, ref, onMounted } from 'vue'
import { isClient } from '@vueuse/core'
import { SysConfig, APP_NAME, APP_ICON } from 'zjf-types'
import { getConfigApi } from '../api'

/** 应用名称 */
const appName = ref(APP_NAME)
/** 应用图标 */
const appIcon = ref(APP_ICON)

let isFetched = false

export function useApp() {
  /**
   * 获取应用的全局配置
   */
  async function getAppConfig() {
    const res = await getConfigApi<SysConfig.APP>(SysConfig.APP) || {}
    appName.value = res.name || APP_NAME
    appIcon.value = res.icon || APP_ICON
  }

  /**
   * 是否在管理后台
   */
  const isAdmin = computed(() => isClient && window.location.href.includes('/admin'))

  onMounted(() => {
    if (!isFetched) {
      isFetched = true
      getAppConfig()
    }
  })

  return {
    appName,
    appIcon,
    getAppConfig,
    isAdmin
  }
}
