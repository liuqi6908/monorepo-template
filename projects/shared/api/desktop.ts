import type { AxiosRequestConfig } from 'axios'
import type {
  IBatchUpdateDesktopFtpQuotaBodyDto,
  ICreateDesktopBodyDto,
  IDesktop,
  IPaginatedResData,
  IPasswordDto,
  IQueryDto,
  IUpdateDesktopBodyDto,
  IUser,
  IUserIdDto,
} from 'zjf-types'
import type { DesktopVM } from '../types/desktop.interface'
import { useRequest } from '../composables/request'

const { $delete, $get, $patch, $post, $put } = useRequest()

/**
 * 判断当前客户端是否在云桌面内使用
 */
export function isDesktopApi() {
  return $get<boolean>('/desktop/is')
}

/**
 * 创建一个云桌面
 */
export function createDesktopApi(body: ICreateDesktopBodyDto, config?: AxiosRequestConfig) {
  return $put<string>('/desktop', body, undefined, config)
}

/**
 * 自动创建一个云桌面并分配
 */
export function autoCreateDesktopApi(userId: IUserIdDto['userId']) {
  return $put<boolean>(`/desktop/${userId}`)
}

/**
 * 更新一个云桌面
 */
export function updateDesktopApi(desktopId: IDesktop['id'], body: IUpdateDesktopBodyDto) {
  return $patch<boolean>(`/desktop/${desktopId}`, body)
}

/**
 * 删除指定的云桌面
 */
export function deleteDesktopApi(desktopId: IDesktop['id']) {
  return $delete<boolean>(`/desktop/${desktopId}`)
}

/**
 * 批量删除云桌面（无法删除未禁用的）
 */
export function batchDeleteDesktopApi(body: IDesktop['id'][]) {
  return $delete<number>('/desktop/delete/batch', body)
}

/**
 * 批量停用云桌面
 */
export function batchStopDesktopApi(body: IDesktop['id'][]) {
  return $delete<number>('/desktop/stop/batch', body)
}

/**
 * 分配云桌面给指定的用户
 */
export function assignDesktopApi(desktopId: IDesktop['id'], userId: IUser['id']) {
  return $patch<boolean>(`/desktop/${desktopId}/assign/${userId}`)
}

/**
 * 查询云桌面列表
 */
export function queryDesktopApi(body: IQueryDto<IDesktop>) {
  return $post<IPaginatedResData<IDesktop>>('/desktop/query', body)
}

/**
 * 查询指定云桌面的密码
 */
export function queryDesktopPasswordApi(desktopId: IDesktop['id'], body: IPasswordDto) {
  return $post<string>(`/desktop/password/${desktopId}`, body)
}

/**
 * 手动检查云桌面的过期
 */
export function checkDesktopExpireManuallyApi(accessKey: string) {
  return $post<boolean>(`/desktop/check-expire-manually?accesskey=${accessKey}`)
}

/**
 * 批量修改云桌面的文件传输配额
 */
export function batchUpdateDesktopFtpQuotaApi(body: IBatchUpdateDesktopFtpQuotaBodyDto) {
  return $patch<number>('/desktop/ftp/batch', body)
}

/**
 * 批量清空云桌面数据
 */
export function batchClearDesktopDataApi(body: IDesktop['id'][]) {
  return $delete<number>('/desktop/ftp/clear', body)
}

/**
 * 查询当前用户分配的云桌面信息
 */
export function getOwnDesktopApi() {
  return $get<IDesktop>('/desktop/own')
}

/**
 * 获取云桌面虚拟机列表
 */
export function getVMListApi() {
  return $get<DesktopVM[]>('/desktop/vm-list')
}
