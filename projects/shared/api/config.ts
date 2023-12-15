import type { IExportConfigDto, IUploadWorkConfigDto, IUpsertConfigBodyDto } from 'zjf-types'
import { useRequest } from '../composables'

const { $get, $post } = useRequest()

/**
 * 创建或更新全局配置
 */
export function upsertConfigApi(body: IUpsertConfigBodyDto) {
  return $post<IExportConfigDto & IUploadWorkConfigDto>('/config', body)
}

/**
 * 获取指定全局配置
 */
export function getConfigApi(version: string) {
  return $get<IExportConfigDto & IUploadWorkConfigDto>(`/config/${version}`)
}
