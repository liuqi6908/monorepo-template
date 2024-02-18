import { file2FormData } from 'zjf-utils'
import type {
  IFileExportLarge,
  IPaginatedResData,
  IQueryDto,
} from 'zjf-types'
import { useRequest } from '../composables/request'

const { $get, $post, $put } = useRequest()

/**
 * 发起大文件外发的申请
 */
export function exportLgApi(file: File, note = '') {
  const formData = file2FormData(file)
  formData.append('note', note)
  return $put<Omit<IFileExportLarge, 'founder'>>('/export-lg', formData)
}

/**
 * 查询全部的大文件外发记录
 */
export function queryAllExportLgApi(body: IQueryDto<IFileExportLarge>) {
  return $post<IPaginatedResData<IFileExportLarge>>('/export-lg/query', body)
}

/**
 * 查询自己的大文件外发历史记录
 */
export function queryOwnExportLgApi(body: IQueryDto<IFileExportLarge>) {
  return $post<IPaginatedResData<IFileExportLarge>>('/export-lg/query/own', body)
}

/**
 * 通过一个大文件外发申请
 */
export function approveExportLgApi(id: IFileExportLarge['id']) {
  return $post<IFileExportLarge>(`/export-lg/approve/${id}`)
}

/**
 * 驳回一个大文件外发申请
 */
export function rejectExportLgApi(id: IFileExportLarge['id'], body: { reason: string }) {
  return $post<IFileExportLarge>(`/export-lg/reject/${id}`, body)
}

/**
 * 下载大文件外发附件
 */
export function downloadExportLgFileApi(id: IFileExportLarge['id']) {
  return $get<Blob>(
    `/export-lg/file/${id}`,
    undefined,
    false,
    {
      responseType: 'blob',
    },
  )
}

/**
 * 下载自己的已通过大文件外发附件
 */
export function downloadOwnExportLgFileApi(id: IFileExportLarge['id']) {
  return $get<Blob>(
    `/export-lg/file/own/${id}`,
    undefined,
    false,
    {
      responseType: 'blob',
    },
  )
}
