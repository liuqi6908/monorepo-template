import { cmsConfig } from 'shared/constants'
import { getCms } from '~/api/cms'

interface Cms {
  id: string
  json: any
  time: number
}

/** cms缓存 */
const cms: Cms[] = []
/** 缓存过期时间（1分钟） */
const expire = 60 * 1000

export function useCms() {
  const currComponent = (pId: string, id: string): any => {
    return cmsConfig.find(i => i.id === pId)?.children
      .find(i => i.id === id)?.component
  }

  const cmsProps = async (id: string) => {
    const index = cms.findIndex(v => v.id === id)
    if (index >= 0 && Date.now() - cms[index].time <= expire)
      return cms[index].json
    else
      cms.splice(index, 1)
    const json = (await getCms<any>(id)).json
    cms.push({ id, json, time: Date.now() })
    return json
  }

  return {
    currComponent,
    cmsProps,
  }
}
