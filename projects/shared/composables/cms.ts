import { ref } from 'vue'
import type { ICms } from 'zjf-types'
import { getCmsApi } from '~/api'
import { CMS_CONFIG } from '~/constants'
import type { CmsJson } from '~/types'

interface Cms extends ICms<CmsJson[]> {
  time: number
}

/** cms缓存 */
const cms = ref<Cms[]>([])
/** 缓存过期时间（1分钟） */
const expire = 60 * 1000

export function useCms() {
  /**
   * 根据 Cms id 获取组件
   */
  function getComponentById(id: string) {
    return CMS_CONFIG.find(v => v.id === id)?.component
  }

  /**
   * 获取 Cms 内容
   */
  async function getCms(id: string, useCache = false) {
    const index = cms.value.findIndex(v => v.id === id)
    if (useCache && index >= 0 && Date.now() - cms.value[index].time <= expire)
      return cms.value[index].json
    else if (index >= 0)
      cms.value.splice(index, 1)

    const res = await getCmsApi(id)
    cms.value.push({
      ...res,
      time: Date.now(),
    })
    return res.json
  }

  return {
    cms,
    getComponentById,
    getCms,
  }
}
