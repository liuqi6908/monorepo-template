import type {
  IRole,
  IUpsertRoleBodyDto,
} from 'zjf-types'
import { useRequest } from '../composables/request'

const { $get, $delete, $post } = useRequest()

/**
 * 获取全部角色列表
 */
export function getRolesApi() {
  return $get<IRole[]>('/role/list')
}

/**
 * 创建/更新角色
 */
export function upsertRoleApi(body: IUpsertRoleBodyDto) {
  return $post<IRole>('/role/upsert', body)
}

/**
 * 删除角色
 */
export function deleteRoleApi(roleId: string) {
  return $delete<number>(`/role/${roleId}`)
}
