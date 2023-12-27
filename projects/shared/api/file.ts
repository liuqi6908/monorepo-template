import { file2FormData } from 'zjf-utils'
import type {
  IFilePathDto,
  IFileServesBodyDto,
} from 'zjf-types'
import type { FileItem } from '../types/file.interface'
import { useRequest } from '../composables/request'
import { authToken } from '../composables/token'

const { $get, $getUri, $post, $put } = useRequest()

/**
 * 上传公共文件
 */
export function uploadPublicFileApi(body: IFilePathDto, file: File) {
  return $put<string>('/file/public', file2FormData(file), body)
}

/**
 * 获取（下载）公共文件
 */
export function getPublicFileApi(body: IFilePathDto, range: string) {
  return $get<ReadableStream<File>>('/file/public', body, false, {
    headers: {
      range,
    },
  })
}

/**
 * 上传认证素材
 */
export function uploadVerifyAttachmentsApi(file: File, filename?: string) {
  return $put<string>(`/file/private/verify/${filename || file.name}`, file2FormData(file))
}

/**
 * 获取（下载）指定用户上传的认证素材的链接
 */
export function getVerifyAttachmentsUrl(userId: string, filename: string) {
  return $getUri(`/file/private/verify/${userId}/${filename}`, {
    token: authToken.value,
  })
}

/**
 * 上传云桌面申请材料
 */
export function uploadDesktopRequestAttachmentsApi(file: File, filename?: string) {
  return $put<string>(`/file/private/desktop-request/${filename || file.name}`, file2FormData(file))
}

/**
 * 获取（下载）指定用户上传的云桌面申请材料的链接
 */
export function getDesktopRequestAttachmentsUrl(userId: string, filename: string) {
  return $getUri(`/file/private/desktop-request/${userId}/${filename}`, {
    token: authToken.value,
  })
}

/**
 * 上传数据库介绍
 */
export function uploadDbIntroApi(file: File, dataRootId: string, filename?: string) {
  return $put<string>(`/file/private/db/${dataRootId}/${filename || file.name}`, file2FormData(file))
}

/**
 * 获取（下载）指定数据根目录的数据库介绍
 */
export function getDbIntroApi(dataRootId: string, filename: string) {
  return $get<ArrayBuffer>(
    `/file/private/db/${dataRootId}/${filename}`,
    null,
    false,
    {
      responseType: 'arraybuffer',
    },
  )
}

/**
 * 判断文件是否存在
 */
export function fileIsExistApi(body: IFileServesBodyDto) {
  return $post<boolean>('/file/is', body)
}

/**
 * 获取指定文件夹下的文件列表
 */
export function getFolderFilesApi(body: IFileServesBodyDto) {
  return $post<FileItem[]>('/file/files', body)
}
