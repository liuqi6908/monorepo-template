import { file2FormData } from 'zjf-utils'
import type {
  ICreateRootBodyDto,
  IDataDirectory,
  IDataField,
  IUpdateRootBodyDto,
  IUploadTableDataParamDto,
} from 'zjf-types'
import { useRequest } from '../composables/request'

const { $delete, $get, $patch, $put } = useRequest()

/**
 * 创建一个数据大类
 */
export function createRootApi(body: ICreateRootBodyDto) {
  return $put<IDataDirectory>('/data/root', body)
}

/**
 * 删除指定的数据大类
 */
export function deleteRootApi(dataRootId: string) {
  return $delete<number>(`/data/root/${dataRootId}`)
}

/**
 * 更新一个数据大类的信息
 */
export function updateRootApi(dataRootId: string, body: IUpdateRootBodyDto) {
  return $patch<number>(`/data/root/${dataRootId}`, body)
}

/**
 * 获取所有数据大类数据
 */
export function getRootListApi() {
  return $get<IDataDirectory[]>('/data/root/list')
}

/**
 * 上传中间表
 */
export function updateIntermediateTableApi(dataRootId: string, file: File, clear = true) {
  return $put<{
    nodes: number
    fields: number
  }>(`/data/upload/${dataRootId}`, file2FormData(file), { clear })
}

/**
 * 获取指定数据大类的数据
 */
export function getDataByDataRootIdApi(dataRootId: string) {
  return $get<IDataDirectory[]>(`/data/list/${dataRootId}`)
}

/**
 * 获取所有的数据资源（限管理用户权限使用）
 */
export function getAllDataListApi() {
  return $get<IDataDirectory[]>('/data/list/all')
}

/**
 * 更新引用规范
 */
export function updateReferenceApi(dataRootId: string, body: {
  reference: string
}) {
  return $patch<boolean>(`/data/reference/${dataRootId}`, body)
}

/**
 * 获取指定表格的字段说明
 */
export function getFieldsByTableApi(dataDirectoryId: string) {
  return $get<IDataField[]>(`/data/fields/${dataDirectoryId}`)
}

/**
 * 获取数据预览
 */
export function getDataPreviewByTableApi(dataDirectoryId: string) {
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
export function getTableDownloadLinkApi(dataDirectoryId: string) {
  return $get<string>(`/data/download/link/${dataDirectoryId}`)
}
