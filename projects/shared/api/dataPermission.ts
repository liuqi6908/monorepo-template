import type { IUpsertDataRoleBodyDto, IDataRole } from 'zjf-types'
import { useRequest } from '~/composables'

const { $delete, $get, $post } = useRequest()

/**
 * 创建/更新 数据下载角色
 */
export function upsertDataRoleApi(body: IUpsertDataRoleBodyDto) {
  return $post<IDataRole>('/data-permission/data-role/upsert', body)
}

/**
 * 删除数据下载角色
 */
export function deleteDataRoleApi(dataRoleId: string) {
  return $delete<number>(`/data-permission/data-role/${dataRoleId}`)
}

/**
 * 查询指定的数据下载角色详情
 */
export function queryDataRoleDetailsApi(dataRoleId: string) {
  return $get<IDataRole>(`/data-permission/data-role/${dataRoleId}`)
}

/**
 * 列出所有数据下载角色
 */
export function getDataRoleListApi(permission = '') {
  return $get<IDataRole[]>('/data-permission/data-role/list', { permission })
}

/**
 * 查询所有数据下载角色名称
 */
export function getDataRoleNamesApi() {
  return $get<string[]>('/data-permission/data-role/names')
}
