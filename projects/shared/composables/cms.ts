import { ref } from 'vue'
import type { ICms } from 'zjf-types'
import { CMS_COMPONENTS, CMS_CONFIG } from '../constants/cms'
import { getCmsApi } from '../api/cms'
import type { CmsJson } from '../types/cms.interface'

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
  function getComponentById(id?: string) {
    if (!id)
      return

    const cms = CMS_CONFIG.find(v => v.id === id)
    if (cms && typeof cms.component === 'string')
      return CMS_COMPONENTS[cms.component].component
    else
      return CMS_COMPONENTS[id as any]?.component
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

    const res = (await getCmsApi(id)) || {
      id,
      json: [],
    }
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
