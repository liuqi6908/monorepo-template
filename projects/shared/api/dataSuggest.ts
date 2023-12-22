import type {
  IDataSuggestion,
  IPaginatedResData,
  IQueryDto,
} from 'zjf-types'
import { useRequest } from '../composables/request'

const { $delete, $get, $post, $put } = useRequest()

/**
 * 发起一个采购建议
 */
export function createDataSuggestApi(dataDirectoryId: string, body: {
  reason: string
}) {
  return $put<string>(`/data-suggest/${dataDirectoryId}`, body)
}

/**
 * 取消一个采购建议
 */
export function deleteDataSuggestApi(dataDirectoryId: string) {
  return $delete<boolean>(`/data-suggest/${dataDirectoryId}`)
}

/**
 * 查询一个采购建议
 */
export function queryDataSuggestByIdApi(dataDirectoryId: string) {
  return $get<IDataSuggestion>(`/data-suggest/${dataDirectoryId}`)
}

/**
 * 查询采购建议（微观数据）
 */
export function queryDataSuggestApi(body: IQueryDto<IDataSuggestion>) {
  return $post<IPaginatedResData<IDataSuggestion>>('/data-suggest/query', body)
}
