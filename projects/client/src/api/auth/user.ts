import type { IUser } from 'zjf-types'

const { $get } = useRequest()

/**
 * 获取当前登录用户的信息
 * @param relation
 * @returns
 */
export function getProfile(relation: string) {
  return $get<IUser>('/user/profile/own', { relation })
}
