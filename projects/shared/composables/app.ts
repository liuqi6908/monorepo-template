import { ref, onMounted } from 'vue'
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

  onMounted(() => {
    if (!isFetched) {
      isFetched = true
      getAppConfig()
    }
  })

  return {
    appName,
    appIcon,
    getAppConfig
  }
}
