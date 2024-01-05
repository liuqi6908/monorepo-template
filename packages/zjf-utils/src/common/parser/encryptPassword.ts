import { base64Encode } from '../base64'

/**
 * 在 http 请求中加密密码
 * @param password 密码
 * @param key 秘钥
 * @default key zjfUsO
 * @returns 加密后的密码
 */
export function encryptPasswordInHttp(password: string, key = 'zjfUsO') {
  return base64Encode(
    `${key}${password.split('').map(char => String.fromCharCode(char.charCodeAt(0) + 1)).join('')}`,
  )
}
