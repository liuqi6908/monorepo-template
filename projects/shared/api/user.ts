import type {
  ICreateUserBodyDto,
  IGetProfileOwnQueryDto,
  IPaginatedResData,
  IQueryDto,
  IUnbindEmailOwnBodyDto,
  IUnbindPhoneOwnBodyDto,
  IUpdateEmailOwnBodyDto,
  IUpdatePasswordByEmailCodeBodyDto,
  IUpdatePasswordByOldBodyDto,
  IUpdatePasswordByPhoneCodeBodyDto,
  IUpdatePhoneOwnBodyDto,
  IUpdateProfileOwnBodyDto,
  IUser,
  IUserIdDto,
} from 'zjf-types'
import { useRequest } from '../composables/request'

const { $get, $delete, $patch, $post, $put } = useRequest()

/**
 * 创建一个新用户
 */
export function createUserApi(body: ICreateUserBodyDto) {
  return $put<IUser>('/user', body)
}

/**
 * 批量停用用户
 */
export function deleteUserApi(body: IUserIdDto['userId'][]) {
  return $delete<number>('/user', body)
}

/**
 * 批量恢复用户
 */
export function recoverUserApi(body: IUserIdDto['userId'][]) {
  return $patch<number>('/user', body)
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
 * 解绑手机号
 */
export function unbindOwnPhoneApi(body: IUnbindPhoneOwnBodyDto) {
  return $delete<boolean>('/user/own/phone', body)
}

/**
 * 修改手机号
 */
export function updateOwnPhoneApi(body: IUpdatePhoneOwnBodyDto) {
  return $patch<boolean>('/user/own/phone', body)
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
export function updateOwnPasswordByEmailCodeApi(body: IUpdatePasswordByEmailCodeBodyDto) {
  return $patch<boolean>('/user/own/password/email', body)
}

/**
 * 通过手机验证码修改密码（不需要登录）
 */
export function updateOwnPasswordByPhoneCodeApi(body: IUpdatePasswordByPhoneCodeBodyDto) {
  return $patch<boolean>('/user/own/password/phone', body)
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
