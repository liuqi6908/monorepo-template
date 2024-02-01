import { file2FormData } from 'zjf-utils'
import type {
  ICreateRootBodyDto,
  IDataDirectory,
  IDataField,
  IDataRootIdDto,
  IUpdateRootBodyDto,
  IUploadDirectoryQueryDto,
  IUploadTableDataParamDto,
} from 'zjf-types'
import { useRequest } from '../composables/request'

const { $delete, $get, $patch, $put } = useRequest()

/**
 * 创建一个根节点（数据大类）
 */
export function createRootApi(body: ICreateRootBodyDto) {
  return $put<IDataDirectory>('/data/root', body)
}

/**
 * 删除指定的根节点（数据大类）
 */
export function deleteRootApi(dataRootId: IDataRootIdDto['dataRootId']) {
  return $delete<number>(`/data/root/${dataRootId}`)
}

/**
 * 更新一个根节点（数据大类）的信息
 */
export function updateRootApi(dataRootId: IDataRootIdDto['dataRootId'], body: IUpdateRootBodyDto) {
  return $patch<number>(`/data/root/${dataRootId}`, body)
}

/**
 * 批量删除根节点（数据大类）
 */
export function batchDeleteRootApi(body: IDataRootIdDto['dataRootId'][]) {
  return $delete<number>('/data/root/batch', body)
}

/**
 * 获取所有根节点（数据大类）数据
 */
export function getRootListApi() {
  return $get<IDataDirectory[]>('/data/root/list')
}

/**
 * 批量清空根节点（数据大类）数据
 */
export function clearDataByRootIdApi(body: IDataRootIdDto['dataRootId'][]) {
  return $delete<number>('/data/clear/batch', body)
}

/**
 * 上传中间表
 */
export function updateIntermediateTableApi(dataRootId: IDataRootIdDto['dataRootId'], file: File, body: IUploadDirectoryQueryDto) {
  return $put<{
    nodes: number
    fields: number
  }>(`/data/upload/${dataRootId}`, file2FormData(file), body)
}

/**
 * 获取指定数据大类的数据
 */
export function getDataByDataRootIdApi(dataRootId: IDataRootIdDto['dataRootId']) {
  return $get<IDataDirectory[]>(`/data/list/${dataRootId}`)
}

/**
 * 获取所有的数据资源（限用户权限管理、数据管理使用）
 */
export function getAllDataListApi() {
  return $get<IDataDirectory[]>('/data/list/all')
}

/**
 * 更新引用规范
 */
export function updateReferenceApi(dataRootId: IDataRootIdDto['dataRootId'], body: {
  reference: string
}) {
  return $patch<boolean>(`/data/reference/${dataRootId}`, body)
}

/**
 * 获取指定表格的字段说明
 */
export function getFieldsByTableApi(dataDirectoryId: IDataDirectory['id']) {
  return $get<IDataField[]>(`/data/fields/${dataDirectoryId}`)
}

/**
 * 获取数据预览
 */
export function getDataPreviewByTableApi(dataDirectoryId: IDataDirectory['id']) {
  return $get<Record<string, string[]>[]>(
    `/data/preview/${dataDirectoryId}`,
    undefined,
    true,
    {
      headers: {
        notify: false,
      },
    },
  )
}

/**
 * 上传表格 预览/下载 数据
 */
export function updateTableDataApi(param: IUploadTableDataParamDto, file: File) {
  const { uploadType, dataRootId, filename } = param
  return $put<string>(`/data/${uploadType}/${dataRootId}/${filename}`, file2FormData(file))
}

/**
 * 获取数据下载链接
 */
export function getTableDownloadLinkApi(dataDirectoryId: IDataDirectory['id']) {
  return $get<string>(`/data/download/link/${dataDirectoryId}`)
}
