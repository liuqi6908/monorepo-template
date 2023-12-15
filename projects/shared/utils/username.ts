import { IUser } from 'zjf-types'

/**
 * 获取用户名
 * @param user
 * @returns
 */
export function getUsername(user?: IUser) {
  const { verification, nickname, account, email } = user || {}
  return verification?.name || nickname || account || email
}