import { computed, ref } from 'vue'
import { isClient } from '@vueuse/core'
import { APP_ICON, APP_NAME, SysConfig } from 'zjf-types'
import { getConfigApi } from '../api/config'

/** 应用名称 */
const appName = ref(APP_NAME)
/** 应用图标 */
const appIcon = ref(APP_ICON)

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

  return {
    appName,
    appIcon,
    getAppConfig,
    isAdmin,
  }
}
