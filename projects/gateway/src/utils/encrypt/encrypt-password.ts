import * as bcrypt from 'bcrypt'

/**
 * 对密码进行加密
 * @param password 密码
 * @returns 加密后的密码
 */
export async function encryptPassword(password: string) {
  const saltOrRounds = 10
  return await bcrypt.hash(password, saltOrRounds) as string
}

/**
 * 校验密码是否正确
 * @param password 密码
 * @param hash 对照
 * @returns
 */
export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash) as boolean
}
