import type {
  ICreateUserBodyDto,
  IGetProfileOwnQueryDto,
  IPaginatedResData,
  IQueryDto,
  IUnbindEmailOwnBodyDto,
  IUpdateEmailOwnBodyDto,
  IUpdatePasswordByCodeBodyDto,
  IUpdatePasswordByOldBodyDto,
  IUpdateProfileOwnBodyDto,
  IUser,
} from 'zjf-types'
import { useRequest } from '~/composables'

const { $get, $delete, $patch, $post, $put } = useRequest()

/**
 * 创建一个新用户
 */
export function createUserApi(body: ICreateUserBodyDto) {
  return $put<IUser>('/user', body)
}

/**
 * 删除指定用户
 */
export function deleteUserApi(userId: string) {
  return $delete<boolean>(`/user/${userId}`)
}

/**
 * 恢复指定用户
 */
export function recoverUserApi(userId: string) {
  return $patch<boolean>(`/user/${userId}`)
}

/**
 * 获取当前登录用户的信息
 */
export function getOwnProfileApi(body: IGetProfileOwnQueryDto) {
  return $get<IUser>('/user/profile/own', body)
}

/**
 * 修改基本信息
 */
export function updateOwnProfileApi(body: IUpdateProfileOwnBodyDto) {
  return $patch<boolean>('/user/own/profile', body)
}

/**
 * 解绑邮箱
 */
export function unbindOwnEmailApi(body: IUnbindEmailOwnBodyDto) {
  return $delete<boolean>('/user/own/email', body)
}

/**
 * 修改邮箱
 */
export function updateOwnEmailApi(body: IUpdateEmailOwnBodyDto) {
  return $patch<boolean>('/user/own/email', body)
}

/**
 * 通过原密码修改密码（需要登录，账号未设置密码可直接修改）
 */
export function updateOwnPasswordByOldPasswordApi(body: IUpdatePasswordByOldBodyDto) {
  return $patch<boolean>('/user/own/password/old', body)
}

/**
 * 通过邮箱验证码修改密码（不需要登录）
 */
export function updateOwnPasswordByCodeApi(body: IUpdatePasswordByCodeBodyDto) {
  return $patch<boolean>('/user/own/password/code', body)
}

/**
 * 查询用户列表
 */
export function queryUserListApi(body: IQueryDto<IUser>) {
  return $post<IPaginatedResData<IUser>>('/user/query', body)
}

/**
 * 更新指定用户的角色
 */
export function updateUserRoleApi(userId: string, roleId: string) {
  return $patch<number>(`/user/${userId}/role/${roleId}`)
}

/**
 * 更新指定用户的数据角色
 */
export function updateUserDataRoleApi(userId: string, dataRoleId: string) {
  return $patch<number>(`/user/${userId}/role/${dataRoleId}`)
}

/**
 * 批量清空用户密码
 */
export function batchDeleteUserPasswordApi(body: string[]) {
  return $delete<number>('/user/delete/password', body)
}
