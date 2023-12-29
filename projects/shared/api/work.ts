import { file2FormData } from 'zjf-utils'
import type {
  IPaginatedResData,
  IQueryDto,
  IWork,
} from 'zjf-types'
import { useRequest } from '../composables/request'
import { authToken } from '../composables/user'

const { $getUri, $delete, $patch, $post, $put } = useRequest()

/**
 * 上传作品
 */
export function createWorkApi(file: File, title: string, author: string) {
  const formData = file2FormData(file)
  formData.append('title', title)
  formData.append('author', author)
  return $put<IWork>('/work', formData)
}

/**
 * 更新已上传的作品
 */
export function updateWorkApi(id: string, file: File, title: string, author: string) {
  const formData = file2FormData(file)
  formData.append('title', title)
  formData.append('author', author)
  return $patch<IWork>(`/work/${id}`, formData)
}

/**
 * 删除已上传的作品
 */
export function deleteWorkApi(id: string) {
  return $delete<boolean>(`/work/${id}`)
}

/**
 * 查询自己的作品列表
 */
export function queryOwnWorksApi(body: IQueryDto<IWork>) {
  return $post<IPaginatedResData<IWork>>('/work/query/own', body)
}

/**
 * 查询所有的作品列表
 */
export function queryAllWorksApi(body: IQueryDto<IWork>) {
  return $patch<IPaginatedResData<IWork>>('/work/query', body)
}

/**
 * 获取下载指定作品附件的链接
 */
export function getWorkDownloadFileUrl(id: string) {
  return $getUri(`/work/file/${id}`, {
    token: authToken.value,
  })
}
