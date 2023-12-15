import type { ICms, IUpsertCmsBodyDto } from 'zjf-types'
import type { CmsJson } from '../types'
import { useRequest } from '../composables'

const { $get, $post } = useRequest()

/**
 * 创建或更新内容
 */
export function upsertCmsApi(cmsId: string, body: IUpsertCmsBodyDto<CmsJson[]>) {
  return $post<ICms<CmsJson[]>>(`/cms/upsert/${cmsId}`, body)
}

/**
 * 获取 Cms 内容
 */
export function getCmsApi(cmsId: string) {
  return $get<ICms<CmsJson[]>>(`/cms/${cmsId}`)
}
