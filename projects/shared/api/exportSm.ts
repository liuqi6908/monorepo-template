import { file2FormData } from 'zjf-utils'
import type {
  IFileExportSmall,
  IPaginatedResData,
  IQueryDto,
} from 'zjf-types'
import { useRequest } from '../composables/request'
import { authToken } from '../composables/token'

const { $getUri, $post, $put } = useRequest()

/**
 * 发起小文件外发的申请
 */
export function exportSmApi(file: File, note = '') {
  const formData = file2FormData(file)
  formData.append('note', note)
  return $put<Omit<IFileExportSmall, 'founder'>>('/export-sm', formData)
}

/**
 * 查询全部的小文件外发记录
 */
export function queryAllExportSmApi(body: IQueryDto<IFileExportSmall>) {
  return $post<IPaginatedResData<IFileExportSmall>>('/export-sm/query', body)
}

/**
 * 查询自己的小文件外发历史记录
 */
export function queryOwnExportSmApi(body: IQueryDto<IFileExportSmall>) {
  return $post<IPaginatedResData<IFileExportSmall>>('/export-sm/query/own', body)
}

/**
 * 获取下载小文件外发附件的链接
 */
export function getDownloadExportSmFileUrl(id: string) {
  return $getUri(`/export-sm/file/${id}`, {
    token: authToken.value,
  })
}
